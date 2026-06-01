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
  }
}, { 
  timestamps: true 
});


const User = mongoose.model('User', userSchema);
module.exports = User;
