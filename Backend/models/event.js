const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
  location: String,
  city: String,
  category: String,
  image: String,
  pricePerTicket: Number,
  totalTickets: Number,
  availableTickets: Number,
  subEvents: [{
    title: String,
    time: String,
    speaker: String,
    description: String,
    location: String,
    image: String
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
module.exports = mongoose.model('Event', eventSchema);