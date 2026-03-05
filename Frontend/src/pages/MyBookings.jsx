import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/bookings/my');
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div
          className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );

  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white border-b border-gray-200">
        <div
          className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              My Bookings
            </h1>
          </div>
          <Link
            to="/"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">
            Browse more events
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {bookings.length === 0 ?
        <div
          className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto my-10">
          <div
            className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <svg
              className="w-12 h-12"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No tickets yet
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Looks like you haven't booked any events. Discover amazing experiences happening near you!
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all text-lg">
            Explore Events
          </Link>
        </div> :

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bookings.map((booking) =>
          <div
            key={booking._id}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col sm:flex-row hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
            <div
              className="bg-gradient-to-br from-indigo-900 to-purple-900 sm:w-48 p-6 text-white flex flex-col justify-between shrink-0 relative">
              <div
                className="absolute top-1/2 -right-4 w-8 h-8 bg-white rounded-full -translate-y-1/2 z-10 hidden sm:block" />
              <div
                className="absolute top-1/2 -left-4 w-8 h-8 bg-[#F8FAFC] rounded-full -translate-y-1/2 z-10 hidden sm:block" />
              <div
                className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 border-t border-dashed border-white/50 -translate-y-1/2 hidden sm:block" />
              <div>
                <span
                  className="bg-white/20 text-indigo-100 text-xs font-bold px-2 py-1 rounded tracking-widest uppercase mb-4 inline-block">
                  TICKET
                </span>
                <h3
                  className="text-xl font-bold leading-tight line-clamp-2 mt-2 relative z-20">
                  {booking.event?.title || 'Unknown Event'}
                </h3>
              </div>
              <div className="mt-8 relative z-20">
                <p
                  className="text-indigo-200 text-xs uppercase tracking-wider font-semibold mb-1">
                  Date
                </p>
                <p className="font-bold text-sm">
                  {booking.event?.startDate ? new Date(booking.event.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-green-200">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    {booking.status}
                  </div>
                  <span className="text-gray-400 text-xs font-medium">
                    {"ID: "}
                    {booking._id.substring(booking._id.length - 6).toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6">
                  <div>
                    <p
                      className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                      Admit
                    </p>
                    <p
                      className="text-xl font-bold text-gray-900 border-l-2 border-indigo-200 pl-3 leading-none">
                      {booking.ticketsBooked}
                      {" "}
                      <span className="text-sm font-medium text-gray-500">
                        tickets
                      </span>
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                      Paid
                    </p>
                    <p
                      className="text-xl font-bold text-gray-900 border-l-2 border-indigo-200 pl-3 leading-none">
                      ₹
                      {booking.totalAmount}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-500">
                  <svg
                    className="w-4 h-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {"Booked "}
                  {new Date(booking.createdAt).toLocaleDateString()}
                </div>
                {booking.event?._id &&
                <Link
                  to={`/event/${booking.event._id}`}
                  className="text-indigo-600 font-bold hover:text-indigo-800 transition">
                  View Event →
                </Link>}
              </div>
            </div>
          </div>
          )}
        </div>}
      </div>
    </div>
  );

}