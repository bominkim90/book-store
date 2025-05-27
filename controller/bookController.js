const {StatusCodes} = require('http-status-codes');
const pool = require('../db/dbConnection.js');


// '전체'도서 조회
// 쿼리스트링 => 카테고리Int / 신간boolean / limit개씩 / currentPage(=어디서부터 보내줄지)
async function selectAllBooks(req, res) {
  let conn;
  
  try {
    conn = await pool.getConnection()

    // 쿼리스트링은 문자열로 들어옴
    const categoryId = req.query?.categoryId;
    const newBook = req.query?.newBook;
    const limit = (req.query?.limit > 0) ? req.query.limit : 10
    const currentPage = (req.query?.currentPage > 0) ? req.query.currentPage : 1
    
    let message = "";
    let sql = // 그냥 전체
        `SELECT 
          books.*, 
          (SELECT count(*) FROM likes WHERE likes.book_id = books.id) 
          AS like_count
        FROM books
        `;

    if(categoryId && newBook){
      message = "신간의 category 별"
      sql = `
        SELECT 
          books.*, category.name AS category_name,
          (SELECT count(*) FROM likes WHERE likes.book_id = books.id) AS like_count
        FROM books
        LEFT JOIN category ON books.categoryId = category.id 
        WHERE books.categoryId = ${categoryId}
          AND books.pub_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
        `;
    }
    else if (categoryId && !newBook) {
      message = "그냥 category 별";
      sql = `
        SELECT 
          books.*, category.name AS category_name,
          (SELECT count(*) FROM likes WHERE likes.book_id = books.id) AS like_count
        FROM books
        LEFT JOIN category ON books.categoryId = category.id 
        WHERE books.categoryId = ${categoryId}
      `;
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
    
    let [count_books] = await conn.query(
      `SELECT COUNT(*) AS count FROM books`
    );
    count_books = count_books[0].count;
    console.log("count_books : ", count_books);
    
    const totalPage = Math.ceil(parseInt(count_books) / limit); // = (전체 도서 개수 / limit)
    
    console.log("sql : ",sql);
    const [result_selectAll_book] = await conn.query(sql);

    if(result_selectAll_book.length > 0) {
      res.status(StatusCodes.OK).json({
        message :message,
        totalPage : totalPage,
        currentPage : currentPage,        
        data : result_selectAll_book
      });
    }
    else {
      res.status(StatusCodes.NOT_FOUND).json({
        message :"조회된 도서 없음"
      });
    }
  }

  catch (err) {
    console.error(err);
    res.status(StatusCodes.BAD_REQUEST).json({
      message : "도서 조회 실패", 
      error : err
    })
  }

  finally {
    conn.release();
  }
}


// '개별'도서 조회 (+내가 책에 좋아요 했는지 여부 isLiked)
async function selectEachBook(req, res) {
  let conn;

  try {
    conn = await pool.getConnection();
    
    const user_id = req.user?.user_id;
    const {book_id} = req.params;

    let sql;
    if(user_id) {
      sql = `
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
        WHERE books.id = ?`;
    } else {
      sql = `
        SELECT 
          book_store.books.*,
          book_store.category.name AS category_name
        FROM book_store.books
        LEFT JOIN book_store.category
        ON book_store.books.categoryId = book_store.category.id
        WHERE books.id = ?`;
    }

    const sqlValues = [user_id, book_id, book_id];
    const [result] = await conn.query(sql, sqlValues);

    res.status(StatusCodes.OK).json({
      message : "개별 도서 조회",
      data : result
    });
  }

  catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message : "서버 에러",
      error : err
    });
  }

  finally {
    conn.release();
  }
}


module.exports = {
  selectAllBooks,
  selectEachBook
}