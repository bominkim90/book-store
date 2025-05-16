const {StatusCodes} = require('http-status-codes')
const getConn = require('../db/dbConnection.js')


// '전체' 도서 조회
async function selectAllBooks(req, res) {
  try {
    let sql = `
      SELECT *, category.categoryName
      FROM books
      JOIN category ON books.categoryId = category.id
    `
    const conn = await getConn()
    const [result , _] = await conn.query(sql)
    if(result.length > 0) {
      res.status(StatusCodes.OK).json({message :"도서 조회 성공", data : result})
    }
    else {
      res.status(StatusCodes.NOT_FOUND).json({message :"조회된 도서 없음"})
    }
  }
  catch (err) {
    console.error(err)
    res.status(StatusCodes.BAD_REQUEST).json({message : "도서 조회 실패", error : err})
  }
}


// '개별' 도서 조회
async function selectEachBook(req, res) {
  try {
    const {bookId} = req.params
    const conn = await getConn()
    const [result , _] = await conn.query(
      `SELECT * FROM books WHERE id = ?`,
      bookId
    )
    res.status(StatusCodes.OK).json({
      message : "개별 도서 조회",
      data : result
    })
  }
  catch (err) {
    console.error(err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message : "서버 에러",
      error : err
    })
  }
}


module.exports = {
  selectAllBooks,
  selectEachBook
}