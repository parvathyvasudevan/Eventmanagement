const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password: await bcrypt.hash(password, 10), role: role || 'user' });
  await user.save();
  res.json({ msg: 'User created' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true });
  res.json({ user: { id: user._id, name: user.name, role: user.role } });
});


const { protect, adminOnly } = require('../middleware/auth');
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error fetching users' });
  }
});

module.exports = router;