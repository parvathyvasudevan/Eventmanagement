const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  let admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    admin = await User.create({
      name: 'Admin User',
      email: 'admin@eventhub.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Created new admin account: admin@eventhub.com / admin123');
  } else {
    console.log('Admin account already exists! Email: ' + admin.email);

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash('admin123', salt);
    await admin.save();
    console.log('Password reset to: admin123');
  }
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});