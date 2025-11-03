const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth'); // <-- 1. IMPORT MIDDLEWARE

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  // (This route is unchanged)
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  // (This route is unchanged)
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        email: user.email
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;

        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ msg: 'Login successful' });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW ROUTES ---

// @route   GET /api/auth
// @desc    Check if user is logged in
// @access  Private
router.get('/', auth, async (req, res) => {
  // The 'auth' middleware runs first. If the token is valid,
  // req.user will be populated.
  try {
    // We just send back the user data (minus the password)
    // This confirms to the frontend that they are logged in.
    res.json(req.user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/logout
// @desc    Log the user out
router.post('/logout', (req, res) => {
  // To log out, we just clear the cookie.
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0) // Set it to a past date
  });
  res.json({ msg: 'Logout successful' });
});


module.exports = router;