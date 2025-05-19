// Get the client
const mysql = require('mysql2/promise');

// Create the connection to database
const dbConnection = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD, // 이건 홈페이지에는 없어서 추가
    database: process.env.DB_SCHEMA, // 이건 내가 DB 만들때 작성했던 스키마 이름
    timezone : 'local',
    dateStrings: true //  원래는 날것에서 "DATE, DATETIME, TIMESTAMP 타입을 문자열로 받아오겠다"
  }
);

module.exports = dbConnection