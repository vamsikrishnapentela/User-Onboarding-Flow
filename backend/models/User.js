const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  paymentDone: { 
    type: Boolean, 
    default: false 
  },
  onboardingCompleted: { 
    type: Boolean, 
    default: false 
  },
  college: { 
    type: String 
  },
  graduationYear: { 
    type: Number 
  },
  careerGoal: { 
    type: String 
  },
  auditLogs: [{
    action: String,
    timestamp: { type: Date, default: Date.now }
  }],
  isAdmin: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true 
});


const User = mongoose.model('User', userSchema);
module.exports = User;
