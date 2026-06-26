const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  isActive: {
    type: Boolean,
    default: true,
  },
  
  resetOtp: {
    type: String,
    default: null
  },
  resetOtpExpire: {
    type: Date,
    default: null
  }

}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('User', userSchema);