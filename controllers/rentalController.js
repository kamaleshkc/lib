const Rental = require('../models/rental');
const Book = require('../models/book');

const rentBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.userId; // Assuming userId is available in req.user

    // Create a new rental record
    const rental = new Rental({
      user: userId,
      book: bookId,
    });

    await rental.save();

    res.status(201).json({ message: 'Book rented successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error renting book', error });
  }
};

const getRentedBooks = async (req, res) => {
  try {
    // Assuming userId is available in req.user
    const userId = req.user.userId;

    // Find rentals for the current user
    const rentals = await Rental.find({ user: userId }).populate('book');

    // Extract the rented books from the rentals
    const rentedBooks = rentals.map(rental => {
        return {
          book: rental.book,
          rentalDate: rental.rentalDate,
          returned: rental.returned,
          returnDate: rental.returnDate,
          fine: rental.fine,
        };
      });

    res.status(200).json(rentedBooks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rented books', error });
  }
};

const returnBook = async (req, res) => {
    try {
      // Assuming userId is available in req.user
      const userId = req.user.userId;
      const { bookId } = req.body;
  
      // Find the rental record for the specified user and book
      const rental = await Rental.findOne({ user: userId, book: bookId });
  
      if (!rental) {
        return res.status(404).json({ message: 'Rental record not found' });
      }
  
      // Update the rental record to mark it as returned and set the returnDate
      rental.returned = true;
      rental.returnDate = new Date(); // Set returnDate to current timestamp
  
      // Calculate the difference between returnDate and rentalDate in days
      const rentalDays = Math.ceil((rental.returnDate - rental.rentalDate) / (1000 * 60 * 60 * 24));
  
      // Calculate fine if the book is returned after 14 days
      if (rentalDays > 14) {
        const fineAmount = 5 * (rentalDays - 14);
        rental.fine = fineAmount;
      } else {
        rental.fine = 0; // No fine if returned within 14 days
      }
  
      await rental.save();
  
      res.status(200).json({ message: 'Book returned successfully', returnDate: rental.returnDate, fine: rental.fine });
    } catch (error) {
      res.status(500).json({ message: 'Error returning book', error });
    }
  };
  
  const getStaffRentedBooks = async (req, res) => {
    try {
        if (req.user.role !== 'staff') {
            return res.status(403).json({ message: 'Unauthorized: Only staff members can add books' });
        }
      // Find all rentals and populate both book and user details
      const rentals = await Rental.find().populate('book').populate({
        path: 'user',
        select: 'id username',
      });;
  
      // Extract the rented books with user details
      const rentedBooks = rentals.map(rental => {
        return {
          book: rental.book,
          user: rental.user,
          rentalDate: rental.rentalDate,
          returned: rental.returned,
          returnDate: rental.returnDate,
          fine: rental.fine,
        };
      });
  
      res.status(200).json(rentedBooks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching rented books', error });
    }
  };

  module.exports = { rentBook, getRentedBooks, returnBook, getStaffRentedBooks };
  