const {StatusCodes} = require('http-status-codes');
const dbConnection = require('../db/dbConnection.js');


// 주문 하기
async function postCart(req, res) {
  try {
    const {user_id} = req.body;
    const {book_id} = req.params;
    const {count} = req.body;
    const conn = await dbConnection;
    const [result_postCart] = await conn.query(
      `INSERT INTO cart (user_id, book_id, count) VALUES (?, ?, ?)`,
      [user_id, book_id, count]
    );
    if(result_postCart.affectedRows === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message : "장바구니 담기 0개"
      })
    }
    return res.status(StatusCodes.CREATED).json({
      message : "장바구니 담기 성공"
    })
  }
  catch (err) {
    console.error("error: ",err);
    if(err.code === 'ER_DUP_ENTRY') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message : "장바구니 담기 실패 - 이미 장바구니에 있음"
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      message : "필수값 입력 안함 - SQL입력 오류"
    });
  }
}


// 주문 목록 조회
async function getCart(req, res) {
  try {
    const {user_id} = req.body
    const conn = await dbConnection;
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


// 장바구니 삭제 (한개씩 삭제 가능)
async function deleteCart(req, res) {
  try {
    const {cart_id} = req.params;
    const {user_id} = req.body;

    const conn = await dbConnection;
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


module.exports = {
  postCart,
  getCart,
  deleteCart
}