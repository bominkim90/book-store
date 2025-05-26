const jwt = require('jsonwebtoken')


function jwtCheck(req, res, next) {
  try {
    // 1. req 헤더의 authorization 확인
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return
    }
    const token = authHeader.split(' ')[1];

    // 3. 토큰 디코드 (검증 포함)
    const decoded = jwt.verify(token, process.env.jwtSecretKey)
    console.log("decoded : ",decoded)

    // 4. 유효한 토큰이라면, 디코드된 정보 req.user에 담기
    req.user = decoded
  }
  catch(err) { // jwt.verify() 실패시 -> Error객체 throw해서 여기로 옴
    console.error("JWT 검사 실패 : ", err)
    if(err.name === 'TokenExpiredError') {
      req.jwtError = "토큰 만료"
    } else {
      req.jwtError = "유효하지 않은 토큰"
    }
  }
  finally {
    next()
  }
}


module.exports = jwtCheck