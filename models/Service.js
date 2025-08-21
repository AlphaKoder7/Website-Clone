const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['health', 'education', 'infrastructure', 'utilities', 'administration'],
    required: true
  },
  requirements: [{
    type: String
  }],
  procedure: [{
    step: Number,
    description: String
  }],
  fees: {
    amount: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },
  processingTime: {
    type: String
  },
  contactPerson: {
    name: String,
    designation: String,
    phone: String,
    email: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);