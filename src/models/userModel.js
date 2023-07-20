const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  groups: {
    type: [String]
  },
  notifications: {
    type: [String]
  }
});

const User = mongoose.model('User', eventSchema);

module.exports = User;
