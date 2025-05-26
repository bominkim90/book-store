
---

## ✅ ERD 구조 요약

```markdown
## 7. ERD 구조 (데이터베이스 테이블 설계)

### 📘 users
| 컬럼명     | 타입        | 설명         |
|------------|-------------|--------------|
| id         | VARCHAR     | 사용자 ID (PK) |
| password   | VARCHAR     | 암호화된 비밀번호 |
| nickname   | VARCHAR     | 닉네임       |
| salt       | VARCHAR     | 비밀번호 암호화용 salt |

---

### 📗 books
| 컬럼명     | 타입     | 설명          |
|------------|----------|---------------|
| id         | INT      | 도서 ID (PK)  |
| title      | VARCHAR  | 제목          |
| price      | INT      | 가격          |
| category   | VARCHAR  | 카테고리      |

---

### ❤️ likes
| 컬럼명     | 타입     | 설명          |
|------------|----------|---------------|
| user_id    | VARCHAR  | 유저 ID (FK) |
| book_id    | INT      | 도서 ID (FK) |
> 유저가 같은 책에 중복 좋아요를 할 수 없도록 `(user_id, book_id)` 유니크 제약 조건 설정

---

### 🛒 cart
| 컬럼명     | 타입     | 설명          |
|------------|----------|---------------|
| id         | INT      | 장바구니 PK   |
| user_id    | VARCHAR  | 유저 ID (FK)  |
| book_id    | INT      | 도서 ID (FK)  |
| count      | INT      | 수량          |

---

### 📦 orders
| 컬럼명     | 타입     | 설명          |
|------------|----------|---------------|
| id         | INT      | 주문 ID (PK)  |
| user_id    | VARCHAR  | 유저 ID (FK)  |
| receiver  | VARCHAR  | 수령인 이름   |
| address    | VARCHAR  | 배송 주소     |
| created_at | DATETIME | 주문 시각     |

---

### 🧾 order_items
| 컬럼명     | 타입     | 설명               |
|------------|----------|--------------------|
| id         | INT      | PK                 |
| order_id   | INT      | 주문 ID (FK)       |
| book_id    | INT      | 도서 ID (FK)       |
| count      | INT      | 구매 수량          |

> 하나의 주문에 여러 도서를 포함할 수 있도록 `order_items` 테이블로 1:N 관계 구성
