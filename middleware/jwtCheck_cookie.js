const jwt = require('jsonwebtoken')


function jwtCheck(req, res, next) {
  try {
    // 1. req 정보의 쿠키에서 access_token 확인
    const token = req.cookies.access_token
    
    // 2. 토큰이 없으면 로그인 안된 상태 -> next() 호출 (또는 로그인 요구 처리)
    if(!token) return

    // 3. 토큰 디코드 (검증 포함) -> json 형태로 나옴
    const decoded = jwt.verify(token, process.env.jwtSecretKey)
    console.log("decoded : ",decoded)

    // 4. 유효한 토큰이라면, 디코드된 정보 req.user에 담기
    req.user = decoded
  }

  catch(err) { // jwt.verify() 실패시 -> Error객체 throw해서 여기로 옴
    console.error("JWT 검사 실패 : ", err)

    if(err.name === 'TokenExpiredError') { // 유효기간 만료
      req.jwtError = "expired" 
    } 
    else { // 내가 발행한(서명한) jwt가 아님
      req.jwtError = "invalid"
    }
  }
  
  finally {
    next()
  }
}


module.exports = jwtCheck