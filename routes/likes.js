
const express = require('express')
const router = express.Router()

// 좋아요 등록
router.post('/:bookId', (req, res) => {
  const {bookId} = req.params
  console.log("bookId : ",bookId)
  const {userId} = req.body
  console.log("userId : ",userId)
  res.status(200).json({
    message : "좋아요 등록됨"
  })
})

// 좋아요 취소
router.delete('/:bookId', (req, res) => {
  const {bookId} = req.params
  console.log("bookId : ",bookId)
  const {userId} = req.body
  console.log("userId : ",userId)
  res.status(200).json({
    message : "좋아요 취소됨"
  })
})


module.exports = router