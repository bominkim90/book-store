const dbConnection = require('../db/dbConnection.js');
const {StatusCodes} = require('http-status-codes');
const crypto = require('crypto'); // 암호화 모듈

// 회원가입
async function registerController(req, res) {
  try {
    const {id, password} = req.body;
    // 비밀번호 암호화
    // 회원가입 시 비밀번호를 암호화해서 암호화된 비밀번호와, salt 값을 같이 저장
    // 로그인 시 => id & password(날 것) => salt값 꺼내서, 비밀번호 암호화 해보고 => DB 비밀번호랑 비교교
    const salt = crypto.randomBytes(64).toString('base64'); // 요건 회원마다 DB에 저장 (로그인 시 pw + 이 salt로 암호화 => DB에 salt랑 비교)
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
    const conn = await dbConnection;
    const [result_INSERT_users] = await conn.query(
      `INSERT INTO users (id, password, salt) VALUES (?, ?, ?)`,
      [id, hashPassword, salt]
    );
    res.status(StatusCodes.CREATED).json({
      message : "회원 가입 성공"
    });
  }
  catch (err) {
    console.error(err)
    res.status(StatusCodes.BAD_REQUEST).json({
      result: err,
      message : "에러 발생"
    });
  }
}

// 비밀번호 변경(초기화)
async function changePwController(req, res) {
  try {
    const {id, password} = req.body;
    // 비밀번호 암호화
    const salt = crypto.randomBytes(64).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');

    const conn = await dbConnection;
    const [result_UPDATE_users] = await conn.query(
      `UPDATE users SET password = ?, salt = ? WHERE id = ?`,
      [hashPassword, salt, id]
    );
    if(result_UPDATE_users.changedRows === 0) {
      throw new Error("비밀번호 변경 실패");
      return
    }
    res.status(200).json({
      message : "비밀번호 변경 성공"
    });
  }
  catch (err) {
    console.error("error : ",err);
    if(err.message == '비밀번호 변경 실패') {
      return res.status(400).json({
        result : err.message
      });
    }
    return res.status(500).json({
      message : "에러 발생"
    });
  }
}



module.exports = {
  registerController,
  changePwController
}