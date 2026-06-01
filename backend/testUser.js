require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB for testing.');

    try {
      // Create a new User document
      const testUser = new User({
        name: "Test User",
        email: `test${Date.now()}@example.com`, // Unique email every time
        password: "securepassword123",
        paymentDone: true,
        onboardingCompleted: false,
        college: "Global Tech University",
        graduationYear: 2026,
        careerGoal: "Full Stack Developer"
      });

      // Save it to the database
      const savedUser = await testUser.save();
      console.log('🎉 User document created successfully!');
      console.log(savedUser);

    } catch (error) {
      console.error('❌ Error creating user:', error.message);
    } finally {
      // Disconnect and exit
      mongoose.connection.close();
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  });
