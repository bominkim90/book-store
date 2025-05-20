const express = require('express');
const router = express.Router();


// 장바구니에서 "체크한" 상품 목록 조회
// 같은 메서드일 경우 => '특정 경로'는 '동적 파라미터'보다 먼저 선언되어야 처리가 된다. 
const {getCheckedItems} = require('../controller/cartController.js');
router.post('/getCheckedItems', getCheckedItems);


// 장바구니 '담기'
const {postCart} = require('../controller/cartController.js');
router.post('/:book_id', postCart);


// 장바구니 '조회'
const {getCart} = require('../controller/cartController.js');
router.get('/', getCart);


// 장바구니 '삭제'
const {deleteCart} = require('../controller/cartController.js');
router.delete('/:cart_id', deleteCart);


module.exports = router;