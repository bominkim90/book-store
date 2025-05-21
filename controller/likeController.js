const {StatusCodes} = require('http-status-codes');
const dbConnection = require('../db/dbConnection.js');


// 좋아요 등록
async function addLike (req, res) {
  try {
    // 원래는 jwt발급 한 상태라면 => 서버에서 프론트에서 HTTP요청 올 때, 자동으로 넘겨주는 쿠키를 확인하여 user데이터 확인.
    // ex) const token = req.cookies.acces_token; => 이 token값을 가진 user 데이터 조회
    const {user_id} = req.body;
    const {book_id} = req.params;

    // (DB안에서 처리함) ALTER TABLE likes ADD CONSTRAINT unique_like UNIQUE (user_id, book_id);
    // DB TABLE안에서 이미 (user_id, book_id) 한 쌍으로 UNIQUE 제약을 걸어두었다.
    // 그래서 API내에서 따로 중복 좋아요 처리를 할 필요가 없다.
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    const [result] = await conn.query(
      `INSERT INTO book_store.likes (user_id, book_id)
      VALUES (?, ?)`,
      [user_id, book_id]
    )
    if(result.affectedRows === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message : "좋아요 등록 실패"
      });
    }
    return res.status(StatusCodes.CREATED).json({
      message : "좋아요 등록됨"
    });
  }
  catch(err) {
    console.log("err : ",err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success : false,
      message : "중복 등록 또는 서버 에러"
    });
  }
}


// 좋아요 취소
async function removeLike (req, res) {
  try {
    const {user_id} = req.body;
    const {book_id} = req.params;
    const conn = await dbConnection
    const [result_DELETE_likes] = await conn.query(
      `DELETE FROM book_store.likes WHERE user_id = ? AND book_id = ?`,
      [user_id, book_id]
    )
    if(result_DELETE_likes.affectedRows === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message : "좋아요 삭제된 row가 0개"
      });
    }
    return res.status(StatusCodes.OK).json({
      message : "좋아요 삭제됨"
    });
  }
  catch(err) {
    console.log("err : ",err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success : false,
      message : "서버 에러"
    });
  }
}


// 좋아요 개수 조회
async function getLike (req, res) {
  try {
    const {book_id} = req.params;
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    const [result_likes_count] = await conn.query(
      `SELECT count(*) AS like_count
      FROM book_store.likes WHERE book_id = ?`,
      [book_id]
    );
    const like_count = result_likes_count[0].like_count;
    console.log("like_count : ", like_count);
    return res.status(StatusCodes.OK).json({
      message : "",
      count : like_count
    });
  }
  catch(err) {
    console.log("err : ",err)
    res.status(StatusCodes.BAD_REQUEST).json({
      success : false,
      message : "조회 실패"
    });
  }
}


module.exports = {
  addLike,
  removeLike,
  getLike
}