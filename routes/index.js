
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({
    message : "홈 - 도서 구매 사이트"
  })
})

module.exports = router