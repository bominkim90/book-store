const mysql = require('mysql2/promise');
// mysql2/promise는 비동기 API를 가진 mysql 모듈이고,
// createPool()은 바로 실행되는 동기 함수.
// 반환되는 pool은 Promise 객체가 아니라, **비동기 메서드를 포함한 "pool 객체"**.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  timezone: '+09:00',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true
});
module.exports = pool;
/*
  createPool(): 여러 개의 연결을 미리 만들어둠
  → 이 구조 덕분에 요청마다 독립적인 연결을 확보할 수 있음
  → 동시에 여러 명이 사용해도 꼬이지 않음

  사용 예시 코드
  try {
    const conn = await pool.getConnection(); // 연결창구 하나를 꺼내옴
    await conn.beginTransaction(); // 트랜잭션 시작

    await conn.query('INSERT INTO orders ...');
    await conn.query('INSERT INTO orderItems ...');
    await conn.query('DELETE FROM cart ...');

    await conn.commit(); // 전부 성공 → 확정 저장
  } 
  catch (err) {
    await conn.rollback(); // 하나라도 실패 → 전부 취소
  }
  finally {
    conn.release(); // 재사용 가능하도록 돌려놓기기
  }

*/







/***********************************************************/
/*
  // 앱이 시작될 때 딱 1번 생성됨
  ex) controller.js
  const conn = await dbConnection; // 이 conn은 **이미 생성된 Promise 객체를 가져오는 것**
*/
// const mysql = require('mysql2/promise');
// const dbConnection = mysql.createConnection(
//   {
//     host: 'localhost',
//     user: 'root',
//     password: process.env.DB_PASSWORD, // 이건 홈페이지에는 없어서 추가
//     database: process.env.DB_SCHEMA, // 이건 내가 DB 만들때 작성했던 스키마 이름
//     timezone : 'local',
//     dateStrings: true //  원래는 날것에서 "DATE, DATETIME, TIMESTAMP 타입을 문자열로 받아오겠다"
//   }
// );
// module.exports = dbConnection

/*
  둘 차이점

*/