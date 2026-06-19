const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, required: true, trim: true },
  phone:      { type: String, required: true, trim: true },
  email:      { type: String, trim: true, lowercase: true },
  service:    { type: String, required: true },
  date:       { type: String, required: true },
  branch:     { type: String, enum: ['Main Branch', 'Gorgorious Branch'], default: 'Main Branch' },
  notes:      { type: String, trim: true },
  status:     { type: String, enum: ['pending','confirmed','cancelled','completed'], default: 'pending' },
  createdAt:  { type: Date, default: Date.now }
});

// Virtual: full name
bookingSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Booking', bookingSchema);
