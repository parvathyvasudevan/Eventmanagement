const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Event = require('../models/event');
const { protect, adminOnly } = require('../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret'
});

router.post('/create-razorpay-order', protect, async (req, res) => {
  try {
    const { amount } = req.body; // Expect amount in INR
    if (!amount) {
      return res.status(400).json({ msg: 'Amount is required' });
    }

    const options = {
      amount: amount * 100, // Razorpay works in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ msg: 'Failed to create Razorpay order' });
    }

    res.json({ 
      order, 
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key_id' 
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ msg: 'Server error generating order' });
  }
});

router.post('/verify-razorpay-signature', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, eventId, tickets, totalPrice } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret';
    
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ msg: 'Invalid payment signature' });
    }

    // Payment is authentic, now process the standard booking logic
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, availableTickets: { $gte: tickets } },
      { $inc: { availableTickets: -tickets } },
      { new: true }
    );

    if (!updatedEvent) {
       // In a real app, you would initiate a refund here if event was sold out post-payment
      return res.status(400).json({ msg: 'Payment collected, but event sold out. Contact support for refund.' });
    }

    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      ticketsBooked: tickets,
      totalAmount: totalPrice || tickets * updatedEvent.pricePerTicket
    });
    
    await booking.save();

    res.json({ msg: 'Payment verified and booking successful!', booking });
  } catch (error) {
    res.status(500).json({ msg: 'Server error during payment verification' });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { eventId, tickets } = req.body;


    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, availableTickets: { $gte: tickets } },
      { $inc: { availableTickets: -tickets } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({ msg: 'Not enough tickets available or event sold out.' });
    }

    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      ticketsBooked: tickets,
      totalAmount: req.body.totalPrice || tickets * updatedEvent.pricePerTicket
    });
    await booking.save();

    res.json({ msg: 'Booking successful!', booking });
  } catch (error) {
    res.status(500).json({ msg: 'Server error during booking' });
  }
});

router.get('/my', protect, async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('event');
  res.json(bookings);
});


router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find().
    populate('user', 'name email').
    populate('event', 'title startDate city').
    sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching bookings' });
  }
});

module.exports = router;