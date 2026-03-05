const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/eventdb').
then(async () => {
  try {
    const user = await User.findOne({ email: 'admin@eventhub.com' });
    if (!user) {
      console.log('User not found!');
    } else {
      console.log('User found:', user);
      const match = await bcrypt.compare('admin123', user.password);
      console.log('Password match:', match);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});