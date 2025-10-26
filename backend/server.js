const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// --- 1. Initial Setup ---
// Load environment variables from .env file
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// --- 2. Connect to Database ---
connectDB();

// --- 3. Middleware ---
app.use(cors()); // Allow cross-origin requests (from our frontend)
app.use(express.json()); // Parse incoming JSON requests

// --- 4. API Routes ---
// We "mount" our auth router at the '/api/auth' path
// All routes in 'auth.js' will be prefixed with '/api/auth'
app.use('/api/auth', require('./routes/auth'));

// (Later, we can add more routes)
// app.use('/api/slots', require('./routes/slots'));

// --- 5. Start Server ---
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

// --- 4. API Routes ---
app.use('/api/auth', require('./routes/auth'));

// Add this new line:
app.use('/api/trainees', require('./routes/trainees'));