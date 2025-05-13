
const express = require('express')
const router = express.Router()

// 주문 하기
router.post('/', (req, res) => {
  const {cartId, adress, receiver} = req.body
  // cartId는 cart_id를 여러개 담고있는 배열(book_id, count등 담겨있음)
  res.status(200).json({
    message : "주문하기 성공공"
  })
})

// 주문 목록 조회회
router.get('/', (req, res) => {
  const {userId} = req.body
  res.status(200).json({
    message : "주문 목록 조회 성공"
  })
})


module.exports = router