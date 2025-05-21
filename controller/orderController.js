const {StatusCodes} = require('http-status-codes');
const pool = require('../db/dbConnection.js');


// 주문 하기
async function postOrder(req, res) {
  const { user_id, cart_id_arr, adress, receiver } = req.body;
  const conn = await pool.getConnection();
  let totalPrice = 0;

  try {
    await conn.beginTransaction();

    // cart에서 주문 항목 한번에 조회
    const [order_items] = await conn.query(
      `SELECT cart.book_id, cart.count, books.price
       FROM cart
       JOIN books ON cart.book_id = books.id
       WHERE cart.id IN (?)`,
      [cart_id_arr]
    );

    // 주문 테이블 저장
    const [result_order_insert] = await conn.query(
      `INSERT INTO orders (user_id, adress, receiver, totalPrice)
       VALUES (?, ?, ?, ?)`,
      [user_id, adress, receiver, 0]
    );
    const order_id = result_order_insert.insertId;

    // 주문 상세 저장 + 가격 누적 계산
    for (const item of order_items) { // await만 넣으면 순차적으로 잘 된다.
      await conn.query(
        `INSERT INTO orderItems (book_id, count, order_id) VALUES (?, ?, ?)`,
        [item.book_id, item.count, order_id]
      );
      totalPrice += item.price * item.count;
    }

    // totalPrice 반영
    await conn.query(
      `UPDATE orders SET totalPrice = ? WHERE id = ?`,
      [totalPrice, order_id]
    );

    // cart에서 삭제
    await conn.query(
      `DELETE FROM cart WHERE id IN (?)`,
      [cart_id_arr]
    );

    await conn.commit();
    res.status(StatusCodes.OK).end();
  } 
  catch (err) {
    await conn.rollback();
    console.error("에러 : ", err);
    res.status(StatusCodes.BAD_REQUEST).json({ message: "주문하기 실패" });
  } 
  finally {
    conn.release(); // 에러가 나든 말든 항상 커넥션 반환
  }
}


// 주문 목록 '상세' 조회
async function getEachOrder(req, res) {
  try {
    const {cart_id} = req.params;
    const {user_id} = req.body;

    const conn = await pool.getConnection();
    await conn.beginTransaction();
    const [result_deleteCart] = await conn.query(
      "DELETE FROM cart WHERE id = ? AND user_id = ?",
      [cart_id, user_id]
    );
    if(result_deleteCart.affectedRows === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message : "장바구니 삭제 0개"
      })
    }
    return res.status(StatusCodes.OK).json({
      message : "장바구니 삭제 성공"
    })
  }
  catch (err) {
    console.error("error: ",err);
    return res.status(StatusCodes.BAD_REQUEST).json({
      message : "잘못된 입력값"
    });
  }
}


// 주문 목록 '전체' 조회
async function getAllOrder(req, res) {
  try {
    const {user_id} = req.body
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    const [result_getCart] = await conn.query(
      `
        SELECT 
          cart.*, books.title, books.description, books.price
        FROM cart
        LEFT JOIN books ON cart.book_id = books.id
        WHERE user_id = ?
      `,
      user_id
    );
    return res.status(200).json(result_getCart)
  }
  catch(err) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
}


module.exports = {
  postOrder,
  getEachOrder,
  getAllOrder
}