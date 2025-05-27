# 📚 도서 구매 사이트 API 명세서

## 👤 회원 API

### 1. 회원 가입

| 항목           | 내용                                                    |
| ------------ | ----------------------------------------------------- |
| Method       | POST                                                  |
| URI          | `/users`                                              |
| Status Code  | `201 Created`                                         |
| Request Body | `{ "email": "user@example.com", "password": "1234" }` |
| Response     | 없음                                                    |

---

## 🔐 로그인 API

### 1. 로그인

| 항목           | 내용                                                    |
| ------------ | ----------------------------------------------------- |
| Method       | POST                                                  |
| URI          | `/login`                                              |
| Status Code  | `200 OK`                                              |
| Request Body | `{ "email": "user@example.com", "password": "1234" }` |
| Response     | JWT 토큰 발행 (쿠키에 저장)                                    |

### 2. 비밀번호 초기화 - 이메일 확인

| 항목           | 내용                                |
| ------------ | --------------------------------- |
| Method       | POST                              |
| URI          | `/reset`                          |
| Status Code  | `200 OK`                          |
| Request Body | `{ "email": "user@example.com" }` |
| Response     | 없음                                |

### 3. 비밀번호 초기화 - 비밀번호 수정

| 항목           | 내용                                                       |
| ------------ | -------------------------------------------------------- |
| Method       | PUT                                                      |
| URI          | `/reset`                                                 |
| Status Code  | `200 OK`                                                 |
| Request Body | `{ "email": "user@example.com", "password": "new1234" }` |
| Response     | 없음                                                       |

---

## 📘 도서 API

### 1. 도서 등록

| 항목           | 내용                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| Method       | POST                                                                                                 |
| URI          | `/books`                                                                                             |
| Status Code  | `200 OK`                                                                                             |
| Request Body | `{ "title": "책 제목", "description": "설명", "writer": "저자", "price": 12000, "pub_date": "2025-05-01" }` |
| Response     | 등록된 전체 도서 리스트 반환                                                                                     |

### 2. 전체 도서 조회

| 항목          | 내용                                                   |
| ----------- | ---------------------------------------------------- |
| Method      | GET                                                  |
| URI         | `/books`                                             |
| Status Code | `200 OK`                                             |
| Query       | `?categoryId=1&new=true` (선택)                        |
| Response    | `{ title, writer, description, price, num_likes }[]` |

### 3. 개별 도서 조회 (+ 좋아요 여부)

| 항목          | 내용                                                                                                  |
| ----------- | --------------------------------------------------------------------------------------------------- |
| Method      | GET                                                                                                 |
| URI         | `/books/:id`                                                                                        |
| Status Code | `200 OK`                                                                                            |
| Response    | `{ title, category, writer, description, price, num_likes, isLiked }`<br>※ 로그인 상태일 경우 `isLiked` 표시됨 |

---

## ❤️ 좋아요 API

### 1. 좋아요 등록

| 항목           | 내용                   |
| ------------ | -------------------- |
| Method       | POST                 |
| URI          | `/likes/:book_id`    |
| Status Code  | `200 OK`             |
| Request Body | 없음 (JWT 토큰으로 사용자 인증) |
| Response     | 없음                   |

### 2. 좋아요 취소

| 항목           | 내용                |
| ------------ | ----------------- |
| Method       | DELETE            |
| URI          | `/likes/:book_id` |
| Status Code  | `200 OK`          |
| Request Body | 없음                |
| Response     | 없음                |

---

## 🛒 장바구니 API

### 1. 장바구니 담기

| 항목           | 내용                             |
| ------------ | ------------------------------ |
| Method       | POST                           |
| URI          | `/cart`                        |
| Status Code  | `201 Created`                  |
| Request Body | `{ "book_id": 1, "count": 2 }` |
| Response     | 없음                             |

### 2. 장바구니 조회

| 항목          | 내용                                                                           |
| ----------- | ---------------------------------------------------------------------------- |
| Method      | GET                                                                          |
| URI         | `/cart`                                                                      |
| Status Code | `200 OK`                                                                     |
| Response    | `[{ cart_id, book_id, count, title, description, price }]` (JOIN으로 도서 정보 포함) |

### 3. 장바구니 아이템 삭제

| 항목          | 내용               |
| ----------- | ---------------- |
| Method      | DELETE           |
| URI         | `/cart/:book_id` |
| Status Code | `200 OK`         |
| Response    | 삭제 완료            |

### 4. 장바구니에서 “체크한” 상품 조회

| 항목           | 내용                                                         |
| ------------ | ---------------------------------------------------------- |
| Method       | POST                                                       |
| URI          | `/cart/checked-items`                                      |
| Status Code  | `200 OK`                                                   |
| Request Body | `{ "checkedIds": [1, 2, 3] }`                              |
| Response     | `{ cart_id, book_id, title, description, count, price }[]` |

---

## 🧾 주문 API

### 1. 주문 생성 (결제)

| 항목           | 내용        |
| ------------ | --------- |
| Method       | POST      |
| URI          | `/orders` |
| Status Code  | `200 OK`  |
| Request Body |           |

```json
{
  "order_items": [
    { "book_id": 1, "count": 2 },
    { "book_id": 3, "count": 1 }
  ],
  "address": "서울시 강남구",
  "receiver": "김뻠",
  "totalPrice": 39000
}
```

\| Response | 주문 성공 메시지 |
\| 비고 | 주문 후 해당 cart\_id는 장바구니에서 삭제 처리됨 |

### 2. 주문 전체 목록 조회

| 항목          | 내용        |
| ----------- | --------- |
| Method      | GET       |
| URI         | `/orders` |
| Status Code | `200 OK`  |
| Response    |           |

```json
[
  {
    "order_id": 10,
    "receiver": "김뻠",
    "address": "서울시 강남구",
    "totalPrice": 39000,
    "orderDate": "2025-05-01"
  }
]
```

### 3. 주문 상세 조회 (상품 목록 포함)

| 항목          | 내용                  |
| ----------- | ------------------- |
| Method      | GET                 |
| URI         | `/orders/:order_id` |
| Status Code | `200 OK`            |
| Response    |                     |

```json
{
  "order_id": 10,
  "items": [
    { "book_id": 1, "title": "책 제목", "count": 2, "price": 12000 },
    { "book_id": 3, "title": "다른 책", "count": 1, "price": 15000 }
  ]
}
```
