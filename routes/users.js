const express = require('express')
const router = express.Router()
const {body, validate} = require('../validation/validate.js') // validation 검사 모듈
const {registerController, changePwController} = require('../controller/userController.js')


// id, password => validation 확인 미들웨어
const idPwValidateMiddleWares = [ 
  body('id').notEmpty().isString().withMessage('id값이 잘못 입력되었습니다'),
  body('password').notEmpty().isString().withMessage('password값이 잘못 입력되었습니다'),
  // validate 함수 : 위에 등록한 req.body로 오는 데이터(id,password)가 notEmpty에 반하거나 하면 => 여기서 응답종료. errMsg를 보냄
  validate, 
]

// 회원 가입
router.post('/',  
  idPwValidateMiddleWares,
  registerController
)

// 비밀번호 변경
router.put('/', 
  idPwValidateMiddleWares,
  changePwController
)


module.exports = router 