const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  name: { 
    type: String, 
    required: [true, 'Product name is required'] 
  },
  price: { 
    type: Number, 
    required: [true, 'Product price is required'] 
  },
  status: {
    type: String,
    enum: ['Available', 'Out of Stock'],
    default: 'Available'
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);