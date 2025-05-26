const pool = require('../db/dbConnection.js');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken'); // jwt 모듈
const crypto = require('crypto');


async function loginController(req, res) {
  const conn = await pool.getConnection();

  try {
    const {user_id, password} = req.body;

    // DB에는 암호화된 비밀번호가 있으니까, 들어온 password를 id의 salt값으로 암호화해서 hashedPassword를 만들어서 DB비번이랑 비교를 해보자
    // 그럼 먼저, id가 존재하는지 확인
    const [result_salt] = await conn.query(`SELECT salt FROM users WHERE id = ?`, user_id);
    const {salt} = result_salt[0]; // 데이터는 여러개 일 수 있어서 => 배열json형태로 들어온다

    if(!salt) { // id 존재 X
      return res.status(StatusCodes.BAD_REQUEST).json({message : "id 존재하지 않음"});
    }
    
    // id 존재 -> password랑 salt 이용해서 암호화해서 hashPassword 만들어내기
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
    
    // id,password로 만들어낸 hashPassword로 => DB에 저장되어있는 hashPassword랑 비교
    const [result_users] = await conn.query(
      `SELECT * FROM users WHERE id = ? AND password = ?`,
      [user_id, hashPassword]
    );
    
    // 비밀번호 틀림
    if(result_users.length < 1) {
      throw new Error("비밀번호 틀림");
    }

    // 로그인 성공
    if(result_users.length === 1){
      // jwt 토큰 발행
      const token = jwt.sign( // (payload, secretOrPrivateKey, [options])
        {user_id:user_id}, 
        process.env.jwtSecretKey,
        {expiresIn: '1h', issuer : "bomin"}
      ) 
      // 쿠키 방식 => jwt 쿠키에 담아 보내기
      // res.cookie('access_token', token, {
      //   httpOnly: true,
      //   secure: false,
      //   sameSite: 'Strict',
      //   maxAge: 1000 * 60 * 60
      // });
      // return res.status(StatusCodes.OK).json({
      //   message : "로그인 성공",
      // });
      /*
      // Authorization헤더 방식 => 그냥 응답의 body에 쌩으로 보냄
      */
     return res.status(StatusCodes.OK).json({token: token})
    }
  }
  catch (err) {
    console.error(err);
    res.status(StatusCodes.BAD_REQUEST).json({
      message : err.message
    });
  }
  finally {
    conn.release()
  }
}

module.exports = loginController;