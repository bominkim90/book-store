const express = require('express')
const router = express.Router()


// 카테고리 '목록' 조회
const {selectAllCategory} = require('../controller/categoryController.js')
router.get('/', selectAllCategory)


// 카테고리 별 '도서' 조회
const {selectCategoryBook} = require('../controller/categoryController.js')
router.get('/:categoryId', selectCategoryBook)


module.exports = router