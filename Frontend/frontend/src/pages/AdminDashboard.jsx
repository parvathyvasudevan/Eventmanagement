import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [analytics, setAnalytics] = useState({ totalRevenue: 0, totalTickets: 0 });

  const [coupons, setCoupons] = useState([]);
  const [couponForm, setCouponForm] = useState({ code: '', discountPercentage: '', expiryDate: '' });

  const [formData, setFormData] = useState({
    title: '', description: '', startDate: '', endDate: '', location: '', city: '',
    category: '', image: '', pricePerTicket: '', totalTickets: '', subEvents: []
  });
  const [subEvent, setSubEvent] = useState({ title: '', time: '', speaker: '', description: '', location: '', image: '' });
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {

      const [usersRes, bookingsRes, couponsRes] = await Promise.all([
      axios.get('http://localhost:5000/api/auth/users', { withCredentials: true }),
      axios.get('http://localhost:5000/api/bookings/all', { withCredentials: true }),
      axios.get('http://localhost:5000/api/coupons', { withCredentials: true })]
      );

      setCustomers(usersRes.data);
      setAllBookings(bookingsRes.data);
      setCoupons(couponsRes.data);


      const bookings = bookingsRes.data;
      const revenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      const tickets = bookings.reduce((sum, b) => sum + (b.ticketsBooked || 0), 0);
      setAnalytics({ totalRevenue: revenue, totalTickets: tickets });
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post('http://localhost:5000/api/coupons', couponForm, { withCredentials: true });
        alert('Coupon created successfully');
        setCouponForm({ code: '', discountPercentage: '', expiryDate: '' });
        fetchAdminData();
    } catch(err) {
        alert(err.response?.data?.msg || 'Error creating coupon');
    }
  };

  const deleteCoupon = async (id) => {
     if(window.confirm('Are you sure you want to delete this coupon?')) {
         try {
             await axios.delete(`http://localhost:5000/api/coupons/${id}`, { withCredentials: true });
             fetchAdminData();
         } catch(err) {
             alert('Error deleting coupon');
         }
     }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/events');
      const data = res.data;
      setEvents(Array.isArray(data) ? data : data.value || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSubEvent = () => {
    if (subEvent.title && subEvent.time) {
      setFormData({
        ...formData,
        subEvents: [...formData.subEvents, { ...subEvent }]
      });
      setSubEvent({ title: '', time: '', speaker: '', description: '', location: '', image: '' });
    }
  };

  const handleSubEventImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('image', file);
    try {
      const res = await axios.post('http://localhost:5000/api/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSubEvent({ ...subEvent, image: `http://localhost:5000${res.data.imageUrl}` });
    } catch (err) {
      alert('Error uploading image');
    }
  };

  const removeSubEvent = (index) => {
    const newSubs = formData.subEvents.filter((_, i) => i !== index);
    setFormData({ ...formData, subEvents: newSubs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/events/${editingId}`, formData);
        alert('Event updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/events', formData);
        alert('Event created successfully!');
      }
      fetchEvents();
      resetForm();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.msg || 'Something went wrong'));
    }
  };

  const editEvent = (event) => {
    setEditingId(event._id);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
      location: event.location || '',
      city: event.city || '',
      category: event.category || '',
      image: event.image || '',
      pricePerTicket: event.pricePerTicket || '',
      totalTickets: event.totalTickets || '',
      subEvents: event.subEvents || []
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', startDate: '', endDate: '', location: '', city: '',
      category: '', image: '', pricePerTicket: '', totalTickets: '', subEvents: []
    });
    setSubEvent({ title: '', time: '', speaker: '', description: '', location: '', image: '' });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const [activeTab, setActiveTab] = useState('events');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      <aside
        className="w-full md:w-64 bg-indigo-900 text-white shrink-0 flex flex-col md:sticky md:top-0 md:h-screen">
        <div
          className="p-6 border-b border-indigo-800 flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <svg
              className="w-6 h-6 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Admin Panel
          </div>
          <Link
            to="/"
            className="text-indigo-300 hover:text-white transition text-sm md:hidden text-right whitespace-nowrap">
            Exit
          </Link>
        </div>
        <nav
          className="p-4 space-y-2 flex-grow sm:flex sm:flex-row md:flex-col overflow-x-auto md:overflow-visible custom-scrollbar">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition ${activeTab === 'events' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-indigo-200 hover:bg-white/10'}`}>
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Manage Events
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition ${activeTab === 'customers' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-indigo-200 hover:bg-white/10'}`}>
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Customers
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition ${activeTab === 'analytics' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-indigo-200 hover:bg-white/10'}`}>
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics & Sales
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition ${activeTab === 'coupons' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'text-indigo-200 hover:bg-white/10'}`}>
            <svg
              className="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Coupons
          </button>
        </nav>
        <div
          className="p-6 border-t border-white/10 hidden md:block mt-auto text-sm text-indigo-300">
          <Link to="/" className="flex items-center gap-2 hover:text-white transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Exit Admin Panel
          </Link>
        </div>
      </aside>
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">
        <div
          className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <h2
            className="text-2xl font-bold text-gray-900 capitalize flex items-center gap-2">
            {activeTab === 'events' ? 'Manage Events' :
            activeTab === 'customers' ? 'Registered Customers' :
            activeTab === 'analytics' ? 'Sales Analytics' :
            'Coupon Management'}
          </h2>
          {activeTab === 'events' &&
          <button
            onClick={() => {
              if (!isFormOpen) resetForm();
              setIsFormOpen(!isFormOpen);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-md shadow-indigo-600/20 flex items-center gap-2">
            {isFormOpen ?
            <React.Fragment>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel Form
            </React.Fragment> :

            <React.Fragment>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4" />
              </svg>
              New Event
            </React.Fragment>}
          </button>}
        </div>
        <div className="p-8">
          {activeTab === 'events' &&
          <div className="max-w-7xl mx-auto">
            {isFormOpen &&
            <div
              className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-10 overflow-hidden transform transition-all">
              <div
                className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {editingId ?
                  <React.Fragment>
                    <svg
                      className="w-5 h-5 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {" Edit Event"}
                  </React.Fragment> :

                  <React.Fragment>
                    <svg
                      className="w-5 h-5 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {" Create New Event"}
                  </React.Fragment>}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-4 md:col-span-2">
                    <h3
                      className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">
                      Basic Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Event Title *
                        </label>
                        <input
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required={true}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none"
                          placeholder="e.g. Kerala Literary Festival" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required={true}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none cursor-pointer">
                          <option value="">
                            Select a category
                          </option>
                          <option value="Literature">
                            Literature
                          </option>
                          <option value="Music">
                            Music
                          </option>
                          <option value="Art">
                            Art
                          </option>
                          <option value="Festival">
                            Festival
                          </option>
                          <option value="Exhibition">
                            Exhibition
                          </option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required={true}
                        rows="3"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none"
                        placeholder="Give a detailed description of what the event is about..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Main Event Image (Upload or URL)
                      </label>
                      <div className="flex gap-2">
                        <input
                          name="image"
                          value={formData.image}
                          onChange={handleChange}
                          className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none"
                          placeholder="https://example.com/image.jpg" />
                        <label
                          className="flex-none bg-indigo-50 text-indigo-700 px-4 py-3 rounded-xl border border-indigo-100 font-semibold text-sm cursor-pointer hover:bg-indigo-100 transition flex items-center justify-center">
                          Upload File
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                const fd = new FormData();fd.append('image', file);
                                try {
                                  const res = await axios.post('http://localhost:5000/api/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                                  setFormData({ ...formData, image: `http://localhost:5000${res.data.imageUrl}` });
                                } catch (err) {alert('Upload failed');}
                              }} />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3
                      className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2 mt-4 md:mt-0">
                      Location & Time
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required={true}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none"
                          placeholder="e.g. Kochi" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Venue Address *
                        </label>
                        <input
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required={true}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none"
                          placeholder="e.g. Bolgatty Palace, Kochi" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date & Time *
                        </label>
                        <input
                          name="startDate"
                          type="datetime-local"
                          value={formData.startDate}
                          onChange={handleChange}
                          required={true}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date & Time *
                        </label>
                        <input
                          name="endDate"
                          type="datetime-local"
                          value={formData.endDate}
                          onChange={handleChange}
                          required={true}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3
                      className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2 mt-4 md:mt-0">
                      Ticketing
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price per Ticket (₹) *
                        </label>
                        <input
                          name="pricePerTicket"
                          type="number"
                          min="0"
                          value={formData.pricePerTicket}
                          onChange={handleChange}
                          required={true}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none"
                          placeholder="e.g. 500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Capacity *
                        </label>
                        <input
                          name="totalTickets"
                          type="number"
                          min="1"
                          value={formData.totalTickets}
                          onChange={handleChange}
                          required={true}
                          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm outline-none"
                          placeholder="e.g. 1000" />
                      </div>
                    </div>
                    <h3
                      className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2 mt-6">
                      Schedule / Sub-events Builder
                    </h3>
                    <div className="bg-gray-50 p-4 border border-gray-200 rounded-xl space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          placeholder="Session Name *"
                          value={subEvent.title}
                          onChange={(e) => setSubEvent({ ...subEvent, title: e.target.value })}
                          className="p-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500" />
                        <input
                          placeholder="Time * (e.g. 10:00 AM)"
                          value={subEvent.time}
                          onChange={(e) => setSubEvent({ ...subEvent, time: e.target.value })}
                          className="p-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500" />
                        <input
                          placeholder="Speaker (optional)"
                          value={subEvent.speaker}
                          onChange={(e) => setSubEvent({ ...subEvent, speaker: e.target.value })}
                          className="p-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          placeholder="Location (optional)"
                          value={subEvent.location}
                          onChange={(e) => setSubEvent({ ...subEvent, location: e.target.value })}
                          className="p-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500" />
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600 whitespace-nowrap">
                            Photo:
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSubEventImageUpload}
                            className="p-1 border border-gray-300 rounded-lg text-sm w-full bg-white file:mr-2 file:py-1 file:px-2 file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
                        </div>
                      </div>
                      <textarea
                        placeholder="Description (optional)"
                        value={subEvent.description}
                        onChange={(e) => setSubEvent({ ...subEvent, description: e.target.value })}
                        rows="2"
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-indigo-500" />
                      {subEvent.image && <div className="text-sm text-green-600 font-medium">
                        ✓ Image uploaded successfully
                      </div>}
                      <button
                        type="button"
                        onClick={addSubEvent}
                        className="w-full bg-indigo-100 text-indigo-700 font-semibold py-2 rounded-lg hover:bg-indigo-200 transition text-sm flex items-center justify-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4" />
                        </svg>
                        Add Session
                      </button>
                      {formData.subEvents.length > 0 &&
                      <div className="mt-4 space-y-2">
                        {formData.subEvents.map((sub, i) =>
                        <div
                          key={i}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 p-3 rounded-lg text-sm shadow-sm group gap-3">
                          <div className="flex items-start gap-3 w-full">
                            {sub.image && <img
                              src={sub.image}
                              alt="subevent"
                              className="w-12 h-12 rounded object-cover border border-gray-100 shrink-0" />}
                            <div className="flex-1">
                              <div className="mb-1">
                                <span className="font-bold text-gray-900">
                                  {sub.title}
                                </span>
                                <span
                                  className="text-indigo-600 ml-2 font-medium bg-indigo-50 px-2 py-0.5 rounded">
                                  {sub.time}
                                </span>
                              </div>
                              <div className="text-gray-500 text-xs flex flex-wrap gap-x-3 gap-y-1">
                                {sub.speaker && <span>
                                  <span className="font-semibold">
                                    Speaker:
                                  </span>
                                  {" "}
                                  {sub.speaker}
                                </span>}
                                {sub.location && <span>
                                  <span className="font-semibold">
                                    Loc:
                                  </span>
                                  {" "}
                                  {sub.location}
                                </span>}
                              </div>
                              {sub.description && <p className="text-gray-600 text-xs mt-1 line-clamp-1">
                                {sub.description}
                              </p>}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSubEvent(i)}
                            className="text-gray-400 hover:text-red-600 transition p-1.5 rounded-md hover:bg-red-50 shrink-0 self-start sm:self-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        )}
                      </div>}
                    </div>
                  </div>
                </div>
                <div className="pt-8 mt-8 border-t border-gray-100 flex gap-4 md:justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 md:flex-none px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {editingId ? 'Save Changes' : 'Publish Event'}
                  </button>
                </div>
              </form>
            </div>}
            <div>
              <h2
                className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                <span>
                  Active Events Overview
                </span>
                <span className="bg-indigo-100 text-indigo-800 text-sm py-1 px-3 rounded-full">
                  {events.length}
                  {" total"}
                </span>
              </h2>
              {loading ?
              <div className="py-20 flex justify-center">
                <div
                  className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600" />
              </div> :
              events.length === 0 ?
              <div
                className="bg-white border text-center border-gray-200 rounded-2xl p-12 shadow-sm text-gray-500">
                No events found. Click "Create Event" to get started.
              </div> :

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((ev) =>
                <div
                  key={ev._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  <div className="h-32 bg-gray-900 relative">
                    {ev.image ?
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-full object-cover opacity-60" /> :

                    <div className="w-full h-full bg-gradient-to-r from-indigo-800 to-purple-800" />}
                    <div
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {ev.category}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3
                      className="text-lg font-bold text-gray-900 mb-1 leading-tight line-clamp-2"
                      title={ev.title}>
                      {ev.title}
                    </h3>
                    <p
                      className="text-gray-500 text-sm flex items-center gap-1.5 mb-4 font-medium">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {ev.city}
                    </p>
                    <div
                      className="bg-gray-50 rounded-xl p-4 mb-4 grid grid-cols-2 gap-4 border border-gray-100">
                      <div>
                        <p
                          className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">
                          Tickets Sold
                        </p>
                        <p className="font-bold text-gray-900">
                          {ev.totalTickets - (ev.availableTickets || 0)}
                        </p>
                      </div>
                      <div>
                        <p
                          className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">
                          Remaining
                        </p>
                        <p
                          className={`font-bold ${ev.availableTickets < 10 ? 'text-orange-600' : 'text-green-600'}`}>
                          {ev.availableTickets || 0}
                        </p>
                      </div>
                      <div className="col-span-2 mt-2 pt-2 border-t border-gray-200">
                         <p
                          className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">
                          Price
                        </p>
                        <p className="font-bold text-indigo-700">
                          ₹{ev.pricePerTicket}
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => editEvent(ev)}
                        className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 font-semibold py-2.5 rounded-lg hover:bg-indigo-100 transition text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => deleteEvent(ev._id)}
                        className="flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold py-2.5 rounded-lg hover:bg-red-100 transition text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                )}
              </div>}
            </div>
          </div>}
          {activeTab === 'customers' &&
          <div className="max-w-7xl mx-auto">
            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div
                className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  User Directory
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="p-4 border-b border-gray-200 font-bold">
                        Name
                      </th>
                      <th className="p-4 border-b border-gray-200 font-bold">
                        Email
                      </th>
                      <th className="p-4 border-b border-gray-200 font-bold">
                        Role
                      </th>
                      <th className="p-4 border-b border-gray-200 font-bold">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {customers.map((customer) =>
                    <tr key={customer._id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-bold text-gray-900">
                        {customer.name}
                      </td>
                      <td className="p-4 text-gray-600">
                        {customer.email}
                      </td>
                      <td className="p-4">
                        <span
                          className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest">
                          {customer.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                    )}
                    {customers.length === 0 &&
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">
                        No customers found.
                      </td>
                    </tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>}
          {activeTab === 'analytics' &&
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
                <div
                  className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
                  Total Revenue
                </h4>
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  ₹
                  {analytics.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
                <div
                  className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h4 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
                  Tickets Sold
                </h4>
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {analytics.totalTickets}
                </span>
              </div>
              <div
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
                <div
                  className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h4 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">
                  Total Bookings
                </h4>
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {allBookings.length}
                </span>
              </div>
            </div>
            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Event Performance
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="p-4 border-b border-gray-200 font-bold">
                        Event Name
                      </th>
                      <th className="p-4 border-b border-gray-200 font-bold">
                        Tickets Sold
                      </th>
                      <th className="p-4 border-b border-gray-200 font-bold">
                        Remaining Capacity
                      </th>
                      <th className="p-4 border-b border-gray-200 font-bold text-right">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {events.map((ev) => {
                      const eventBookings = allBookings.filter(b => b.event?._id === ev._id);
                      const revenue = eventBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
                      const sold = ev.totalTickets - (ev.availableTickets || 0);
                      
                      return (
                        <tr key={ev._id} className="hover:bg-gray-50 transition">
                          <td className="p-4 font-bold text-gray-900">
                            {ev.title}
                          </td>
                          <td className="p-4 font-bold text-indigo-600">
                            {sold}
                          </td>
                          <td className="p-4 font-bold text-gray-600">
                            {ev.availableTickets || 0}
                          </td>
                          <td className="p-4 font-bold text-green-600 text-right">
                            ₹{revenue.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                    {events.length === 0 &&
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">
                        No events found.
                      </td>
                    </tr>}
                  </tbody>
                </table>
              </div>
            </div>

            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Recent Transactions
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="p-4 border-b border-gray-200 font-bold">
                        Transaction ID
                      </th>
                      <th className="p-4 border-b border-gray-200 font-bold">
                        Event
                      </th>
                      <th className="p-4 border-b border-gray-200 font-bold">
                        Customer
                      </th>
                      <th className="p-4 border-b border-gray-200 font-bold">
                        Amount
                      </th>
                      <th className="p-4 border-b border-gray-200 font-bold">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allBookings.map((booking) =>
                    <tr key={booking._id} className="hover:bg-gray-50 transition">
                      <td className="p-4 text-xs font-mono text-gray-500">
                        {booking._id}
                      </td>
                      <td className="p-4 font-bold text-gray-900 max-w-xs truncate">
                        {booking.event?.title || 'Deleted Event'}
                      </td>
                      <td className="p-4 text-gray-600 font-medium">
                        {booking.user?.name || 'Unknown User'}
                      </td>
                      <td className="p-4 font-bold text-green-600">
                        ₹
                        {booking.totalAmount}
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(booking.createdAt).toLocaleString()}
                      </td>
                    </tr>
                    )}
                    {allBookings.length === 0 &&
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-500">
                        No transactions recorded yet.
                      </td>
                    </tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>}
          {activeTab === 'coupons' &&
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        Create New Coupon
                    </h3>
                </div>
                <form onSubmit={handleCouponSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                            <input 
                                required 
                                value={couponForm.code}
                                onChange={(e) => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})}
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 uppercase"
                                placeholder="SUMMER25"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                            <input 
                                required 
                                type="number"
                                min="1" max="100"
                                value={couponForm.discountPercentage}
                                onChange={(e) => setCouponForm({...couponForm, discountPercentage: e.target.value})}
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                                placeholder="20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <input 
                                required 
                                type="date"
                                value={couponForm.expiryDate}
                                onChange={(e) => setCouponForm({...couponForm, expiryDate: e.target.value})}
                                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition">
                            Create Coupon
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">Active Coupons</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 border-b border-gray-200 font-bold">Code</th>
                                <th className="p-4 border-b border-gray-200 font-bold">Discount</th>
                                <th className="p-4 border-b border-gray-200 font-bold">Expires</th>
                                <th className="p-4 border-b border-gray-200 font-bold">Status</th>
                                <th className="p-4 border-b border-gray-200 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {coupons.map(coupon => (
                                <tr key={coupon._id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-bold text-gray-900 font-mono">{coupon.code}</td>
                                    <td className="p-4 text-green-600 font-bold">{coupon.discountPercentage}%</td>
                                    <td className="p-4 text-gray-500 text-sm">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        {new Date(coupon.expiryDate) > new Date() ? (
                                             <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase">Active</span>
                                        ) : (
                                            <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-md font-bold uppercase">Expired</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => deleteCoupon(coupon._id)} className="text-red-500 hover:text-red-700 p-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {coupons.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">No coupons available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>}
        </div>
      </main>
    </div>
  );

}