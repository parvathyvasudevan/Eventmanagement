const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  ticketsBooked: Number,
  totalAmount: Number,
  status: { type: String, default: 'confirmed' }
}, { timestamps: true });
module.exports = mongoose.model('Booking', bookingSchema);