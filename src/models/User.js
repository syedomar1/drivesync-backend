const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  emailOrPhone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'staff'],
    default: 'admin',
  },
});

module.exports = mongoose.model('User', UserSchema);