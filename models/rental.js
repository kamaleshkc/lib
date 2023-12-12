const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  rentalDate: { type: Date, default: Date.now },
  returned: { type: Boolean, default: false },
  returnDate: { type: Date, default: null },
  fine: { type: Number, default: null }
});

module.exports = mongoose.model('Rental', rentalSchema);