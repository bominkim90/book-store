const {StatusCodes} = require('http-status-codes');
const dbConnection = require('../db/dbConnection.js');


// '전체' 도서 조회
// 쿼리스트링 : 카테고리Int / 신간boolean / limit개씩 / currentPage(=어디서부터 보내줄지)
async function selectAllBooks(req, res) {
  try {
    const {categoryId, newBook} = req.query; // 쿼리스트링은 문자열로 들어옴
    let {limit, currentPage} = req.query;
    limit = parseInt(limit);
    currentPage = parseInt(currentPage);
    let message = "";
    let sql = `
      SELECT 
        books.*, 
        category.name AS category_name,
        (SELECT count(*) FROM likes WHERE likes.book_id = books.id) AS like_count
      FROM books
      LEFT JOIN category ON books.categoryId = category.id 
    `;
    if(categoryId && newBook){
      message = "신간의 카테고리 별";
      sql += `WHERE books.categoryId = ${categoryId}
        AND books.pub_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`;
    }
    else if (categoryId && !newBook) {
      message = "그냥 category별";
      sql += `WHERE books.categoryId = ${categoryId}`;
    }
    else if (newBook && !categoryId) {
      message = "그냥 신간";
      sql += `WHERE books.pub_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`;
    }
    else {
      message = "그냥 전체";
    }
    sql += ` LIMIT ${limit} OFFSET ${limit * (currentPage - 1)}`;
    message += ` : ${limit}개씩 보여주고, ${currentPage}번째 페이지`;
    // db 연결 생성
    const conn = await dbConnection;
    const [result] = await conn.query(sql);
    if(result.length > 0) {
      res.status(StatusCodes.OK).json({message :message, data : result});
    }
    else {
      res.status(StatusCodes.NOT_FOUND).json({message :"조회된 도서 없음"});
    }
  }
  catch (err) {
    console.error(err);
    res.status(StatusCodes.BAD_REQUEST).json({message : "도서 조회 실패", error : err});
  }
}


// '개별' 도서 조회
async function selectEachBook(req, res) {
  try {
    const {user_id} = req.body;
    const {book_id} = req.params;
    const conn = await dbConnection;
    let sql = `
      SELECT 
        book_store.books.*,
        book_store.category.name AS category_name,
        ( SELECT EXISTS  
          (
            SELECT * FROM likes WHERE likes.user_id = ? AND likes.book_id = ?
          )
        ) AS isLiked
      
      FROM book_store.books
      
      LEFT JOIN book_store.category
      ON book_store.books.categoryId = book_store.category.id
      
      WHERE books.id = ?
    `;
    const sqlValues = [user_id, book_id, book_id]
    const [result] = await conn.query(sql, sqlValues);
    console.log("result : ",result);
    res.status(StatusCodes.OK).json({
      message : "개별 도서 조회",
      data : result
    })
  }
  catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message : "서버 에러",
      error : err
    });
  }
}


module.exports = {
  selectAllBooks,
  selectEachBook
}