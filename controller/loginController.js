const dbConnection = require('../db/dbConnection.js');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken'); // jwt 모듈
const crypto = require('crypto');


async function loginController(req, res) {
  try {
    const {id, password} = req.body;
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    // DB에는 암호화된 비밀번호가 있으니까, 들어온 password를 id의 salt값으로 암호화해서 hashedPassword를 만들어서 DB비번이랑 비교를 해보자
    // 그럼 먼저, id가 존재하는지 확인
    console.log("id : ",id);
    const [result_salt] = await conn.query(`SELECT salt FROM users WHERE id = ?`, id);

    const {salt} = result_salt[0]; // 데이터는 여러개 일 수 있어서 => 배열json형태로 들어온다
    console.log("salt : ", salt);
    if(!salt) { // id 존재 X
      return res.status(StatusCodes.BAD_REQUEST).json({message : "id 존재하지 않음"});
    }
    // id 존재 -> password랑 salt 이용해서 암호화 => hashPassword
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
    const [result_users] = await conn.query(
      `SELECT * FROM users WHERE id = ? AND password = ?`,
      [id, hashPassword]
    );
    console.log("result_users : ",result_users);
    if(result_users.length < 1) {
      throw new Error("비밀번호 틀림");
      return
    }
    if(result_users.length === 1){
      // jwt 토큰 발행
      const token = jwt.sign( // (payload, secretOrPrivateKey, [options])
        {id:id}, 
        process.env.jwtSecretKey,
        {expiresIn: '1h', issuer : "bomin"}
      ) ;
      // 토큰 쿠키에 담기
      res.cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        maxAge: 1000 * 60 * 60
      });
      return res.status(StatusCodes.OK).json({
        message : "로그인 성공",
      });
    }
  }
  catch (err) {
    console.error(err);
    console.error(err.message);
    res.status(StatusCodes.BAD_REQUEST)
    .json({
      message : err.message
    });
  }
}

module.exports = loginController;