const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  date: {
    type: Date,
  },
  location: {
    name: {
      type: String,
    },
    coordinates: {
      type: [Number],
      // required: true
    }
  },
  invitations: {
    type: [String]
  },
  participants: {
    type: [String]
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
