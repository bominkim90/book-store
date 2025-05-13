
const express = require('express')
const router = express.Router()

// 로그인
router.post('/', (req, res) => {
  const {id, pw} = req.body
  console.log("id : ",id)
  console.log("pw : ",pw)
  res.status(200).json({
    message : "로그인 성공"
  })
})

module.exports = router