import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import Payment from './pages/Payment';
import ThankYou from './pages/ThankYou';
import Chatbot from './components/Chatbot';
import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/me').then((res) => setUser(res.data)).catch(() => {});
  }, []);

  const Protected = ({ children, adminOnly }) => {
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
    return children;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/event/:id" element={<EventDetail user={user} />} />
        <Route path="/profile" element={<Protected><UserProfile user={user} /></Protected>} />
        <Route path="/my-bookings" element={<Protected><MyBookings /></Protected>} />
        <Route path="/admin" element={<Protected adminOnly><AdminDashboard /></Protected>} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/payment" element={<Protected><Payment user={user} /></Protected>} />
        <Route path="/thank-you" element={<Protected><ThankYou /></Protected>} />
      </Routes>
      <Chatbot />
    </div>
  );

}

export default App;