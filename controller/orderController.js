const {StatusCodes} = require('http-status-codes');
const pool = require('../db/dbConnection.js');
// mysql2/promise는 비동기 API를 가진 mysql 모듈이고,
// createPool()은 바로 실행되는 동기 함수.
// 반환되는 pool은 Promise 객체가 아니라, **비동기 메서드를 포함한 "pool 객체"**


// 주문 하기
async function postOrder(req, res) {
  const { user_id, cart_id_arr, adress, receiver } = req.body;

  // 1. DB 연결 객체 가져오기 (mysql2/promise의 pool에서 connection 하나 가져옴)
  const conn = await pool.getConnection(); 

  let totalPrice = 0;

  try {
    // 2. 트랜잭션 시작 (이 시점부터 수동으로 커밋하기 전까지는 쿼리 결과가 확정되지 않음)
    await conn.beginTransaction();

    // 3. 장바구니(cart) 테이블에서 주문할 도서 목록을 한 번에 조회 (도서 가격 포함)
    const [order_items] = await conn.query(
      `SELECT cart.book_id, cart.count, books.price
       FROM cart
       JOIN books ON cart.book_id = books.id
       WHERE cart.id IN (?)`,
      [cart_id_arr]
    );

    // 4. orders 테이블에 주문 정보 먼저 저장 (총 금액은 아직 0으로 넣어둠)
    const [result_order_insert] = await conn.query(
      `INSERT INTO orders (user_id, adress, receiver, totalPrice)
       VALUES (?, ?, ?, ?)`,
      [user_id, adress, receiver, 0]
    );
    const order_id = result_order_insert.insertId; // 방금 생성된 주문의 고유 ID

    // 5. orderItems 테이블에 주문 상세 정보 저장 + 총 금액 계산
    for (const item of order_items) {
      // 각 주문 항목 저장
      await conn.query(
        `INSERT INTO orderItems (book_id, count, order_id) VALUES (?, ?, ?)`,
        [item.book_id, item.count, order_id]
      );
      // 금액 누적 계산
      totalPrice += item.price * item.count;
    }

    // 6. orders 테이블에 총 금액(totalPrice) 업데이트
    await conn.query(
      `UPDATE orders SET totalPrice = ? WHERE id = ?`,
      [totalPrice, order_id]
    );

    // 7. 주문이 완료되었으므로 장바구니에서 해당 항목들 삭제
    await conn.query(
      `DELETE FROM cart WHERE id IN (?)`,
      [cart_id_arr]
    );

    // 8. 지금까지의 모든 쿼리 실행을 최종적으로 확정(commit)
    await conn.commit();

    // 9. 클라이언트에 성공 응답
    res.status(StatusCodes.OK).end();
  } 
  catch (err) {
    // 10. 중간에 어떤 에러가 발생했다면 지금까지의 모든 작업을 취소 (되돌림:롤백)
    await conn.rollback();
    console.error("에러 : ", err);
    res.status(StatusCodes.BAD_REQUEST).json({ message: "주문하기 실패" });
  } 
  finally {
    // 11. try든 catch든 상관없이 DB 연결은 반드시 반환해야 다음 요청에서 재사용 가능
    conn.release();
  }
}


// 사용자 주문 목록 '전체' 조회 (GET /orders)
// 주문일자, 배송정보(주소, 수령인), totalPrice, 상품정보(책이름, 개수)
async function getAllOrder(req, res) {
  const conn = await pool.getConnection();
  const {user_id} = req.body

  try {
    // 1. orders 정보 조회
    const [orders] = await conn.query(
      `SELECT * FROM orders WHERE user_id = ?`, user_id
    )
    if(orders.length === 0) { // IN (?) 문법에 빈 배열 들어가면 에러나므로, 0개면 종료
      return res.status(StatusCodes.OK).json(orders)
    }
    const orderIds = orders.map(value => value.id)
    
    // 2. orderItems + books JOIN 조회
    const [orderDetails] = await conn.query(
      `SELECT orderItems.order_id, orderItems.count, books.title
      FROM orderItems
      LEFT JOIN books ON orderItems.book_id = books.id
      WHERE orderItems.order_id IN (?)`,
      [orderIds]
    )
    
    // 3. orders 배열에 orderInfos 구성
    const grouped = orders.map(order => {
      const matchedItems = orderDetails
      .filter(detail => detail.order_id === order.id)
      .map(matched => {return {[matched.title] : matched.count} })

      return {
        ...order,
        orderInfos: matchedItems
      }
    })
    
    return res.status(StatusCodes.OK).json(grouped)
  }
  catch(err) {
    console.error("주문 조회 에러 : ", err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end()
  }
}


// 주문 '상세' 조회
// 주문한 '책'들 상세 정보
async function getEachOrder(req, res) {
  const {order_id} = req.params
  const conn = await pool.getConnection()

  try {
    // 주문 items 테이블 조회 => count + books에서 책 상세 정보
    const [orderItems] = await conn.query(
      `SELECT orderItems.count, books.title, books.writer, price
      FROM orderItems
      LEFT JOIN books ON orderItems.book_id = books.id
      WHERE orderItems.order_id = ?`, 
      order_id
    )

    res.status(StatusCodes.OK).json(orderItems)
  }
  catch(err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end()
  }
}


module.exports = {
  postOrder,
  getEachOrder,
  getAllOrder
}