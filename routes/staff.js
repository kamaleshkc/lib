const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');

router.get('/rented_book', rentalController.getStaffRentedBooks);

module.exports = router;