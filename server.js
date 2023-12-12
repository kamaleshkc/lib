const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');
const rentalRoutes = require('./routes/rental');
const staffRoutes = require('./routes/staff');
const app = express();
const PORT = process.env.PORT || 3000;
const cors =require('cors')

app.use(bodyParser.json());
// Use CORS middleware with options
app.use(cors("*"));
// Connect to MongoDB db name is rental
mongoose.connect('mongodb://localhost:27017/rental', { useNewUrlParser: true, useUnifiedTopology: true });

app.use((req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, 'don', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      req.user = {
        userId: decoded.userId,
        role: decoded.role, 
      };
      next();
    });
  } else {
    next();
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/rental', rentalRoutes);
app.use('/api/staff', staffRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
