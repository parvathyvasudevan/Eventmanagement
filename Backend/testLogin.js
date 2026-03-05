const axios = require('axios');

async function testLogin() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@eventhub.com',
      password: 'admin123'
    });
    console.log('Login successful!', res.data);
  } catch (err) {
    console.error('Login failed!', err.response ? err.response.data : err.message);
  }
}

testLogin();