
const express = require('express')
const router = express.Router()

// 전체 도서 조회
router.get('/', (req, res) => {
  res.status(200).json({
    message : "전체 도서 조회"
  })
})

module.exports = router