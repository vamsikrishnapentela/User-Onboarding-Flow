const mongoose = require('mongoose');

// Define the schema for a User
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // Ensures no two users can register with the same email
  },
  password: { 
    type: String, 
    required: true 
  },
  paymentDone: { 
    type: Boolean, 
    default: false // By default, payment is not done
  },
  onboardingCompleted: { 
    type: Boolean, 
    default: false // By default, onboarding is not completed
  },
  college: { 
    type: String 
  },
  graduationYear: { 
    type: Number 
  },
  careerGoal: { 
    type: String 
  }
}, { 
  timestamps: true // Automatically creates 'createdAt' and 'updatedAt' fields
});

// Create and export the model so we can use it in other files
const User = mongoose.model('User', userSchema);
module.exports = User;
