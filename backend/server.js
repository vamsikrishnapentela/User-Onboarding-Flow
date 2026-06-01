require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Database Connection
// We use the MONGO_URI from our .env file to keep credentials secure
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB!');
  })
  .catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error.message);
  });

// Basic Homepage Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API!',
    status: 'Server is running successfully.'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
