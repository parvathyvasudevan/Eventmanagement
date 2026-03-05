import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home({ user }) {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ city: '', category: '', date: '' });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setIsSearching(true);
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.category) params.category = filters.category;
      if (filters.date) params.date = filters.date;
      const res = await axios.get('http://localhost:5000/api/events', { params });
      const data = res.data;

      setEvents(Array.isArray(data) ? data : data.value || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 relative">
      <nav
        className="absolute top-0 w-full z-50 text-white p-6 md:px-12 flex justify-between items-center">
        <div
          className="font-extrabold text-2xl tracking-tighter flex items-center gap-2">
          <svg
            className="w-8 h-8 text-pink-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            EventHub
          </span>
        </div>
        <div className="flex gap-6 items-center font-medium">
          {user ?
          <React.Fragment>
            <span className="text-indigo-200 hidden md:block">
              {"Welcome, "}
              {user.name || 'User'}
            </span>
            <Link to="/profile" className="text-sm hover:text-white transition">
              My Profile
            </Link>
            <Link to="/my-bookings" className="text-sm hover:text-white transition">
              My Bookings
            </Link>
          </React.Fragment> :

          <React.Fragment>
            <Link
              to="/login"
              className="text-sm hover:text-pink-300 transition-colors font-semibold">
              Log In
            </Link>
            <Link
              to="/login"
              className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-6 py-2.5 rounded-full transition-all text-sm font-bold shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Sign Up
            </Link>
          </React.Fragment>}
        </div>
      </nav>
      <div
        className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white pt-36 pb-24 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-6xl mx-auto text-center z-10">
          <span
            className="inline-block py-1 px-3 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-medium tracking-wide mb-6 backdrop-blur-sm">
            Discover What's Happening
          </span>
          <h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            {"Find Your Next "}
            <br className="hidden md:block" />
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
              Unforgettable Experience
            </span>
          </h1>
          <p
            className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto font-light mb-12">
            Explore the best events, exhibitions, and festivals happening across amazing locations.
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20 mb-16">
        <div
          className="bg-white rounded-2xl shadow-xl shadow-indigo-900/5 p-4 md:p-6 border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full relative">
            <div
              className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              type="text"
              name="city"
              placeholder="Search by event name or city..."
              value={filters.city}
              onChange={handleFilterChange}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 font-medium placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-base outline-none" />
          </div>
          <div className="w-px h-12 bg-gray-200 hidden md:block" />
          <div className="flex-1 w-full relative">
            <div
              className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full pl-12 pr-10 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-base appearance-none cursor-pointer outline-none">
              <option value="">
                All Categories
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
            <div
              className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="w-px h-12 bg-gray-200 hidden md:block" />
          <div className="flex-1 w-full relative">
            <div
              className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-base outline-none" />
          </div>
          <button
            onClick={() => setFilters({ city: '', category: '', date: '' })}
            className="w-full md:w-auto px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors whitespace-nowrap">
            Clear
          </button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Trending Events
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              Discover the most popular happenings around you.
            </p>
          </div>
          <div
            className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hidden md:block">
            {events.length}
            {" "}
            {events.length === 1 ? 'event' : 'events'}
            {" found"}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.length === 0 && !isSearching ?
          <div className="col-span-full py-20 text-center">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              We couldn't find any events matching your current filters. Try adjusting your search criteria.
            </p>
            <button
              onClick={() => setFilters({ city: '', category: '', date: '' })}
              className="mt-6 px-6 py-3 bg-indigo-600 font-medium text-white rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
              Clear all filters
            </button>
          </div> :

          events.map((event) =>
          <div
            key={event._id}
            className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
            <div className="relative h-56 overflow-hidden bg-gray-100">
              {event.image ?
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> :

              <div
                className="w-full h-full flex items-center justify-center bg-indigo-50/50 text-indigo-200">
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>}
              <div
                className="absolute top-4 right-4 backdrop-blur-md bg-white/95 text-indigo-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">
                {event.category}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div
                className="flex items-center text-sm text-indigo-600 font-bold mb-3 gap-3 uppercase tracking-wider text-xs">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <h3
                className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                {event.title}
              </h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                {event.description}
              </p>
              <div
                className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center text-gray-500 text-sm font-medium">
                  <svg
                    className="w-4 h-4 mr-1.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate max-w-[120px]">
                    {event.city || event.location?.split(',')[0]}
                  </span>
                </div>
                <Link
                  to={`/event/${event._id}`}
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-all text-sm group-hover:bg-indigo-600 group-hover:text-white">
                  View Details
                </Link>
              </div>
            </div>
          </div>
          )}
        </div>
        {user &&
        <div
          className="mt-20 p-8 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
          <div
            className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <div
            className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
            <h3
              className="text-2xl md:text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-100">
              Welcome back!
            </h3>
            <p className="text-indigo-200 font-medium">
              Manage your bookings or access your dashboard to create more events.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4 w-full md:w-auto">
            <Link
              to="/my-bookings"
              className="flex-1 md:flex-none text-center bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition shadow-sm">
              My Bookings
            </Link>
            {user.role === 'admin' &&
            <Link
              to="/admin"
              className="flex-1 md:flex-none text-center bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition shadow-xl">
              Admin Dashboard
            </Link>}
          </div>
        </div>}
      </div>
    </div>
  );

}