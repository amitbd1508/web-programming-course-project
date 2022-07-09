const express = require('express');
const bookController = require('../controllers/bookController');

const router = express.Router();

router.get('/', bookController.getBooks);

router.get('/:bookId', bookController.getBookById);

router.post('/', bookController.save);

router.put('/:bookId', bookController.update);

router.delete('/:bookId', bookController.deleteById);

module.exports = router;