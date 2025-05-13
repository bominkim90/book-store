
const express = require('express')
const router = express.Router()

// 회원 가입
router.post('/', (req, res) => {
  const {id, password} = req.body
  res.status(200).json({
    message : "회원 가입 성공"
  })
})

// 비밀번호 변경
router.put('/', (req, res) => {
  const {id, password} = req.body
  res.status(200).json({
    message : "비밀번호 변경 성공"
  })
})

// 회원 탈퇴
router.get('/', (req, res) => {
  const {id, password} = req.body
  res.status(200).json({
    message : "회원 탈퇴 성공"
  })
})


module.exports = router 