const express = require('express');
const router = express.Router();


// 좋아요 등록
const {addLike} = require('../controller/likeController.js');
router.post('/:book_id', addLike);

// 좋아요 취소
const {removeLike} = require('../controller/likeController.js');
router.delete('/:book_id', removeLike);

// 책 개별 좋아요 개수 조회
const {getLike} = require('../controller/likeController.js');
router.get('/:book_id', getLike);

module.exports = router;