const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: [true, 'User ID/Email is required'] 
  },
  membershipNo: { 
    type: String, 
    required: true,
    unique: true 
  },
  duration: { 
    type: String, 
    enum: ['6 months', '1 year', '2 years'],
    default: '6 months'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active'
  },
  endDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Membership', membershipSchema);