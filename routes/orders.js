const express = require('express')
const router = express.Router()
const {postOrder, getEachOrder, getAllOrder} = require('../controller/orderController.js');


// 주문 하기
router.post('/', postOrder);

// 주문 목록 '상세' 조회
router.get('/:order_id', getEachOrder);

// 주문 목록 '전체' 조회
router.get('/', getAllOrder);


module.exports = router