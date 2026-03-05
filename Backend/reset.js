const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/eventdb').
then(async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash('admin123', salt);
    const res = await mongoose.connection.collection('users').updateOne(
      { email: 'admin@eventhub.com' },
      { $set: { name: 'Event Admin', email: 'admin@eventhub.com', password: pwd, role: 'admin' } },
      { upsert: true }
    );
    console.log('Admin user upserted successfully: ', res);
    process.exit(0);
  } catch (err) {
    console.error('Error during upsert:', err.message);
    process.exit(1);
  }
}).
catch((err) => {
  console.error('Connection error:', err.message);
  process.exit(1);
});