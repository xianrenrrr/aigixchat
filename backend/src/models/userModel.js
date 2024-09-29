const mongoose = require('mongoose');

// Define user interaction schema
const userSchema = new mongoose.Schema({
  carType: {
    type: String,
    required: true
  },
  query: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
