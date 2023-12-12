const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.post('/add', bookController.addBook);
router.get('/list', bookController.getBooks);


module.exports = router;
