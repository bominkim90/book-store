const {body, validationResult} = require('express-validator')

// 미들웨어로 등록할거임
function validate(req, res, next) {
  const err = validationResult(req)
  if (!err.isEmpty()) {
    return res.status(400).json({ 
      data : err.array(), 
      message : "유효성검사에 실패하였습니다." 
    })
  }
  next()
}

module.exports = {
  body, 
  validationResult, 
  validate
}