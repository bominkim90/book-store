const {StatusCodes} = require('http-status-codes');
const pool = require('../db/dbConnection.js');


// 장바구니 담기 (user & book 중복 담기 불가)
async function postCart(req, res) {
  const conn = await pool.getConnection()
  
  try {
    await conn.beginTransaction()

    const {user_id} = req.user
    const {book_id} = req.params
    const {count} = req.body

    // 장바구니 담기 POST
    const [result_postCart] = await conn.query(
      `INSERT INTO cart (user_id, book_id, count) VALUES (?, ?, ?)`,
      [user_id, book_id, count]
    )

    // 장바구니 담기 성공
    await conn.commit()
    return res.status(StatusCodes.CREATED).json({
      message : "장바구니 담기 성공"
    })
  }
  
  catch (err) {
    await conn.rollback()
    console.error("error: ",err)
    
    if(err.code === 'ER_DUP_ENTRY') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message : "장바구니 담기 실패 - 이미 장바구니에 있음"
      })
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      message : "필수값 입력 안함 - SQL입력 오류"
    })
  }

  finally {
    conn.release()
  }
}


// 장바구니 조회
async function getCart(req, res) {
  const conn = await pool.getConnection()

  try {
    const {user_id} = req.user

    const [result_getCart] = await conn.query(
      `SELECT 
        cart.*, books.title, books.description, books.price
      FROM cart
      LEFT JOIN books ON cart.book_id = books.id
      WHERE user_id = ?`,
      user_id
    )

    return res.status(200).json(result_getCart)
  }

  catch(err) {
    return res.status(StatusCodes.BAD_REQUEST).end();
  }

  finally {
    conn.release()
  }
}


// 장바구니 삭제 (한개씩 삭제 가능)
async function deleteCart(req, res) {
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()
  
    const {user_id} = req.user
    const {cart_id} = req.params

    const [result_deleteCart] = await conn.query(
      "DELETE FROM cart WHERE id = ? AND user_id = ?",
      [cart_id, user_id]
    )

    // 삭제 성공
    await conn.commit()
    return res.status(StatusCodes.OK).json({
      message : "장바구니 삭제 성공"
    })
  }

  catch (err) {
    await conn.rollback()
    console.error("error: ",err)
    
    return res.status(StatusCodes.BAD_REQUEST).json({
      message : "잘못된 입력값"
    })
  }

  finally {
    conn.release()
  }
}


// 장바구니에서 "체크한" 상품 목록 조회
async function getCheckedItems(req, res) {
  const conn = await pool.getConnection()

  try {
    const {user_id} = req.user
    const {cart_ids} = req.body

    if(cart_ids.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message : "cart_ids 개수 0개"
      });
    }

    let placeholder = 
      cart_ids.map( value => "?" ) // ["?", "?", "?"] 배열 형태로
      .join(); // "?, ?, ?" 문자열 형태로

    const [rows_checkedItems] = await conn.query(
      `SELECT 
        cart.*, books.title, books.description, books.price
      FROM cart
      LEFT JOIN books ON cart.book_id = books.id
      WHERE user_id = ? AND cart.id IN (${placeholder})`,
      [user_id , ...cart_ids]
    )

    return res.status(StatusCodes.OK).json(rows_checkedItems)
  }

  catch(err) {
    console.log("장바구니에서 체크한 상품 목록 조회 '실패' ", err)
    return res.status(StatusCodes.BAD_REQUEST).end()
  }

  finally {
    conn.release()
  }
}


module.exports = {
  postCart,
  getCart,
  deleteCart,
  getCheckedItems
}