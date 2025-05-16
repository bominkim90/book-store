const {StatusCodes} = require('http-status-codes')
const getConn = require('../db/dbConnection.js')


// 카테고리 '목록' 조회
async function selectAllCategory(req, res) {
  try {
    const conn = await getConn()
    const [result , _] = await conn.query(
      `SELECT * FROM category`
    )
    res.status(StatusCodes.OK).json({message :"카테고리 목록 조회 성공", data : result})
  }
  catch (err) {
    console.error(err)
    res.status(StatusCodes.BAD_REQUEST).json({message : "조회 실패", error : err})
  }
}


// 카테고리 별 '도서' 조회
async function selectCategoryBook(req, res) {
  try {
    const {categoryId} = req.params
    const conn = await getConn()
    let sql = `
      SELECT *, category.categoryName
      FROM books
      JOIN category ON books.categoryId = category.id
      WHERE categoryId = ${categoryId}
    `
    const [result , _] = await conn.query(sql)
    res.status(StatusCodes.OK).json({message : "카테고리 별 도서 조회 성공", data : result})
  }
  catch (err) {
    console.error(err)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message : "서버 에러", error : err})
  }
}


module.exports = {
  selectAllCategory,
  selectCategoryBook
}