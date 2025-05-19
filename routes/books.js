const express = require('express')
const router = express.Router()


// '전체'(카테고리, 신간) 도서 조회
const {selectAllBooks} = require('../controller/bookController.js')
router.get('/', selectAllBooks)


// '개별' 도서 조회
const {selectEachBook} = require('../controller/bookController.js')
router.get('/:book_id', selectEachBook)


module.exports = router