const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const { protect, adminOnly } = require('../middleware/auth');


router.get('/', async (req, res) => {
  const { city, category, date } = req.query;
  let query = {};

  if (city) {

    const searchRegex = new RegExp(city, 'i');
    query.$or = [
    { title: { $regex: searchRegex } },
    { city: { $regex: searchRegex } }];

  }

  if (category) query.category = category;
  if (date) {
    const searchDate = new Date(date);

    const startOfDay = new Date(searchDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(searchDate);
    endOfDay.setUTCHours(23, 59, 59, 999);



    query.startDate = { $lte: endOfDay };
    query.endDate = { $gte: startOfDay };
  }

  const events = await Event.find(query).sort({ startDate: 1 });
  res.json(events);
});

router.get('/:id', async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.json(event);
});


router.post('/', protect, adminOnly, async (req, res) => {
  const event = new Event({ ...req.body, createdBy: req.user.id, availableTickets: req.body.totalTickets });
  await event.save();
  res.json(event);
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(event);
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted' });
});

module.exports = router;