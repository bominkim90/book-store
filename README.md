# 📚 도서구매 사이트 (Book Store API)

## 1. 프로젝트 주제

도서 상품을 조회하고 장바구니에 담고 구매할 수 있는 **도서 구매 API 서버**를 Node.js + Express 환경에서 구현합니다.  
JWT를 이용한 인증 방식과 라우터/컨트롤러 분리를 통해 실제 서비스 구조에 가까운 백엔드 연습을 목표로 합니다.

---

## 2. 목적

- Node.js + Express를 기반으로 한 **RESTful API 서버 구현**
- MariaDB와의 연동 및 SQL 작성 실습
- 프론트엔드와의 통신 흐름 이해 및 협업 구조 대비
- JWT 인증 흐름 및 쿠키 처리 방식 학습

---

## 3. 기술 스택 및 주요 모듈

| 구분 | 사용 기술 |
|------|-----------|
| 언어 | JavaScript (Node.js) |
| 프레임워크 | Express.js |
| DB 연동 | MariaDB (mysql2) |
| 인증 | JSON Web Token (JWT) |
| 환경 변수 | dotenv |
| 쿠키 파싱 | cookie-parser |
| 요청 검증 | express-validator 모듈 활용 |

**사용한 주요 모듈**
```bash
npm install express dotenv cookie-parser jsonwebtoken mysql2
```

---

## 4. 프로젝트 구조

```
book-store/
├── app.js              # 서버 진입점
├── .env                # 환경변수 (PORT, DB, SECRET_KEY 등)
├── package.json
├── routes/             # 라우터 분리
│   ├── books.js
│   ├── users.js
│   ├── login.js
│   ├── likes.js
│   ├── cart.js
│   ├── orders.js
│   └── index.js
├── controller/         # 라우터에서 분리한 로직 처리
│   └── (ex: bookController.js, userController.js 등)
├── middleware/         # 공통 미들웨어
│   ├── jwtCheck_cookie.js
│   └── jwtCheck_authorization.js
├── db/                 # DB 연결 관련 모듈
│   └── dbConnection.js
├── validation/         # 요청 데이터 유효성 검사 함수
│   └── bodyValidator.js
```

---

## 정리 문서
[Postman API 예시](./docs/api.md)
<br>
[ERD 구조](./docs/erd.md)

---

## 5. 주요 구현 기능
```md
### 라우터-컨트롤러 구조 분리
각각의 API 요청을 목적별 라우터로 구분하고, 실제 로직 처리는 컨트롤러에서 수행하도록 구조화했습니다.


### JWT 인증 처리 - 쿠키 기반
로그인 성공 시 `httpOnly` 쿠키에 JWT를 담아 응답하며, 이후 모든 요청은 `access_token` 쿠키를 통해 인증합니다.  
인증 검사는 공통 미들웨어 `jwtCheck_cookie.js`에서 처리합니다.


### 유효성 검사 (Validation)
사용자의 요청 데이터(`req.body`)에 대해 문자열 길이, 타입, 필수 여부 등을 사전 검증하는 유효성 검사 모듈을 별도 분리해 관리합니다.


### RESTful API 설계
`GET`, `POST`, `DELETE`, `PUT` 등의 메서드에 맞게 API 엔드포인트를 설계했습니다.


### MySQL 연결 시 `createPool()` 사용
데이터베이스 연결을 `mysql.createConnection()`이 아닌 `createPool()`로 구성하여,  
여러 요청에 대해 **동시처리 성능을 높이고**, 커넥션을 재사용 가능하도록 설정했습니다.  
특히 트랜잭션이 필요한 경우, 각 요청마다 커넥션을 빌려 쓰고 반환하는 방식으로 **안정적인 처리**가 가능합니다.


### 주문 처리 API에서의 트랜잭션 적용
`/orders` API의 구현에서는 여러 개의 SQL 쿼리를 순차적으로 실행해야 합니다  
(예: 주문 테이블 삽입 → 주문 상세 삽입).  
이 과정 중 하나라도 오류가 발생하면, 이전 쿼리 결과가 DB에 반영된 채로 남으면 안 되므로,  
`beginTransaction()` → `commit()` 또는 `rollback()` 구조를 사용해  
**하나의 요청 단위를 원자적(Atomic)으로 처리**하도록 구현했습니다.  
이렇게 함으로써 **데이터의 정합성과 무결성**을 보장합니다.
```



---

## ✅ 향후 개선 포인트 (추가 가능 항목)

* Swagger를 통한 API 명세 자동화
* 유닛 테스트 (예: jest)
* JWT refresh token을 통한 인증 유지
* 클라이언트에 쿠키 전달 시 `Secure`, `SameSite` 등 보안 옵션 강화
* 에러 핸들링 통합 미들웨어 추가

---

## ✅ 실행 방법

```bash
npm install
npm run dev
```

`.env` 예시:

```
PORT=1234
DB_HOST=localhost
DB_USER=root
DB_PASSWORD='root'
DB_NAME='book_store'
jwtSecretKey='yeah'
```

---

## 📌 담당자 및 작성자

* 작성자: 김보민
* 구현 기간: 2025.05.08 ~ 2025.05.27
