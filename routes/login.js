const express = require('express')
const router = express.Router()
const {body, validate} = require('../validation/validate.js') // validation
const loginController = require('../controller/loginController.js')


// 로그인
router.post('/', 
  body('id').notEmpty().isString().withMessage('id값이 잘못 입력되었습니다'),
  body('password').notEmpty().isString().withMessage('password값이 잘못 입력되었습니다'),
  validate, 
  loginController
)

module.exports = router