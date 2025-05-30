// 필요 모듈 소화
const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()


// 미들웨어 함수 등록
app.use(express.json()) // 서버가 req.body (JSON형태) 데이터 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 파싱
const cookieParser = require('cookie-parser')
app.use(cookieParser()) // 쿠키 파싱 미들웨어
const jwtCheck = require('./middleware/jwtCheck_cookie.js') // jwt 검사 방식 = 쿠키
// const jwtCheck = require('./middleware/jwtCheck_authorization.js') // jwt 검사 방식 = Authorization
app.use(jwtCheck)


// 라우터 등록
const indexRouter = require('./routes/index.js')
app.use('/', indexRouter)

const usersRouter = require('./routes/users.js')
app.use('/users', usersRouter)

const loginRouter = require('./routes/login.js')
app.use('/login', loginRouter)

const booksRouter = require('./routes/books.js')
app.use('/books', booksRouter)

const likesRouter = require('./routes/likes.js')
app.use('/likes', likesRouter)

const cartRouter = require('./routes/cart.js')
app.use('/cart', cartRouter)

const ordersRouter = require('./routes/orders.js')
app.use('/orders', ordersRouter)


// 서버 오픈
const PORT = process.env.PORT
app.listen(PORT, ()=> {
  console.log(PORT+" 해당 포트넘버로 서버 가동 중")
})