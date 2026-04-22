const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  rsvpStatus: {
    type: String,
    enum: ['Attending', 'Pending', 'Declined'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);