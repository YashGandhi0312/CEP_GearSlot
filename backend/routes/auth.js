const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import our updated User model

// @route   POST /api/auth/register
// @desc    Register a new user


// router.post('/register', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user already exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     // Create new user
//     user = new User({
//       email,
//       password,
//     });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     // Save user to DB
//     await user.save();
    
//     res.status(201).json({ msg: 'User registered successfully' });

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });



// @route   POST /api/auth/login
// @desc    Authenticate user


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Compare plain-text password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // User is valid. Send back a success message
    res.json({ msg: 'Login successful' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;