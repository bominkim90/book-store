const {StatusCodes} = require('http-status-codes')


function loginCheck(res) {
  res.status(StatusCodes.UNAUTHORIZED).json({ // 401 코드 날림
    message : "로그인이 필수인 작업입니다"
  })
}


module.export = loginCheck