require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./middleware/auth');

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    // Verify email doesn't already exist to prevent duplicate accounts
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered. Please use another.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      auditLogs: [{ action: "REGISTERED" }]
    });

    await newUser.save();

    // Auto-login the user by generating a token immediately after signup
    const payload = {
      user: {
        id: newUser._id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token, message: 'User registered and logged in successfully!' });
      }
    );

  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials. Wrong password.' });
    }

    const payload = {
      user: {
        id: user._id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, isAdmin: user.isAdmin, message: 'Logged in successfully!' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
});

app.post('/api/pay', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // Mark payment as complete and track the milestone in audit logs
    user.paymentDone = true;
    if (!user.auditLogs) user.auditLogs = [];
    user.auditLogs.push({ action: "PAYMENT_COMPLETED" });
    
    await user.save();
    
    res.json({ message: 'Payment successful! Proceeding to onboarding.', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error during payment processing.', error: error.message });
  }
});

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
    
    user.college = college;
    user.graduationYear = graduationYear;
    user.careerGoal = careerGoal;
    user.onboardingCompleted = true;
    if (!user.auditLogs) user.auditLogs = [];
    user.auditLogs.push({ action: "ONBOARDING_COMPLETED" });
    
    await user.save();
    
    res.json({ message: 'Onboarding complete!', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error during onboarding.', error: error.message });
  }
});

app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user.', error: error.message });
  }
});

app.get('/api/admin/users', authMiddleware, async (req, res) => {
  try {
    const requestingUser = await User.findById(req.user.id);
    if (!requestingUser || requestingUser.email !== 'admin@test.com') {
      return res.status(403).json({ message: 'Forbidden: Admin access strictly required.' });
    }

    const users = await User.find({ email: { $ne: 'admin@test.com' } }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching admin data.', error: error.message });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API!',
    status: 'Server is running successfully.'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
