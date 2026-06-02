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

// Import our User model and required libraries
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

// ----------------------------------------------------
// STEP 4: REGISTER API
// ----------------------------------------------------
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Validation: Ensure all fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    // 2. Prevent Duplicate Email: Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered. Please use another.' });
    }

    // 3. Hash Password: Securely hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // 5. Send Success Response
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

// ----------------------------------------------------
// STEP 6: LOGIN API
// ----------------------------------------------------
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate inputs
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  try {
    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. User not found.' });
    }

    // 3. Compare passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Wrong password.' });
    }

    // 4. Create and send JWT (STEP 7)
    const payload = {
      user: {
        id: user._id
      }
    };

    // Sign the token with our secret key
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        // Return the token so the frontend can save it
        res.json({ token, message: 'Logged in successfully!' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
});

// ----------------------------------------------------
// STEP 12: PAYMENT API
// ----------------------------------------------------
app.post('/api/pay', authMiddleware, async (req, res) => {
  try {
    // 1. Find the user by the ID extracted from the JWT token
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // 2. Update the user's payment status to true
    user.paymentDone = true;
    
    // 3. Save the updated user to MongoDB
    await user.save();
    
    // 4. Send a success response
    res.json({ message: 'Payment successful! Proceeding to onboarding.', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error during payment processing.', error: error.message });
  }
});

// ----------------------------------------------------
// STEP 16: ONBOARDING API
// ----------------------------------------------------
app.post('/api/onboarding', authMiddleware, async (req, res) => {
  const { college, graduationYear, careerGoal } = req.body;
  
  if (!college || !graduationYear || !careerGoal) {
    return res.status(400).json({ message: 'Please provide all onboarding fields.' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // Update the user's data
    user.college = college;
    user.graduationYear = graduationYear;
    user.careerGoal = careerGoal;
    user.onboardingCompleted = true; // Mark onboarding as done!
    
    await user.save();
    
    res.json({ message: 'Onboarding complete!', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error during onboarding.', error: error.message });
  }
});

// ----------------------------------------------------
// STEP 7: PROTECTED ROUTE (Requires Token)
// ----------------------------------------------------
// Notice the 'authMiddleware' injected before the (req, res) handler
app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    // Because of authMiddleware, req.user is set to the decoded token payload
    // We fetch the user details but exclude the password field
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user.', error: error.message });
  }
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
