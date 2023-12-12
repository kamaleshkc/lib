const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');

router.post('/rent', rentalController.rentBook);
router.get('/list', rentalController.getRentedBooks);
router.post('/return', rentalController.returnBook);

module.exports = router;