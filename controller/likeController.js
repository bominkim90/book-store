const {StatusCodes} = require('http-status-codes');
const pool = require('../db/dbConnection.js');


// 좋아요 등록
async function addLike (req, res) {
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    const {user_id} = req.user
    console.log("좋아요 등록 API에서 req.user : ", req.user)
    const {book_id} = req.params

    // 좋아요 중복 처리 => (DB안에서 처리함) ALTER TABLE likes ADD CONSTRAINT unique_like UNIQUE (user_id, book_id);
    const [result] = await conn.query(
      `INSERT INTO book_store.likes (user_id, book_id)
      VALUES (?, ?)`,
      [user_id, book_id]
    )

    await conn.commit()

    // 좋아요 등록 성공
    return res.status(StatusCodes.CREATED).json({
      result: result,
      message : "좋아요 등록 성공"
    })
  }
  catch(err) {
    await conn.rollback()

    console.log("좋아요 등록 실패 err : ",err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      result : err,
      message : "중복 등록 또는 서버 에러"
    })
  }
  finally {
    conn.release()
  }
}


// 좋아요 취소
async function removeLike (req, res) {
  const conn = await pool.getConnection()

  try {
    await conn.beginTransaction()

    const {user_id} = req.user
    const {book_id} = req.params

    const [result_DELETE_likes] = await conn.query(
      `DELETE FROM book_store.likes WHERE user_id = ? AND book_id = ?`,
      [user_id, book_id]
    )

    await conn.commit()

    return res.status(StatusCodes.OK).json({
      message : "좋아요 삭제됨"
    });
  }
  catch(err) {
    await conn.rollback()

    console.log("err : ",err)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success : false,
      message : "서버 에러"
    });
  }
  finally {
    conn.release()
  }
}


// 좋아요 개수 조회
async function getLike (req, res) {
  const conn = await pool.getConnection();

  try {
    const {book_id} = req.params;

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
  finally {
    conn.release()
  }
}


module.exports = {
  addLike,
  removeLike,
  getLike
}