
const express = require('express')
const router = express.Router()

// 장바구니 담기
router.post('/:bookId', (req, res) => {
  const {userId} = req.body
  const {bookId} = req.params
  const {count} = req.body
  res.status(200).json({
    message : "장바구니 담기 성공공"
  })
})

// 장바구니 삭제
router.delete('/:bookId', (req, res) => {
  const {userId} = req.body
  const {bookId} = req.params
  res.status(200).json({
    message : "장바구니 삭제 성공"
  })
})


module.exports = router