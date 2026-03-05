import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EventDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        setError('Event not found');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const applyCoupon = async () => {
      setCouponError('');
      setCouponSuccess('');
      if(!couponCode) return;
      
      try {
          const res = await axios.post('http://localhost:5000/api/coupons/validate', { code: couponCode }, { withCredentials: true });
          setDiscountPercentage(res.data.discountPercentage);
          setCouponSuccess(`Coupon applied! ${res.data.discountPercentage}% off.`);
      } catch (err) {
          setDiscountPercentage(0);
          setCouponError(err.response?.data?.msg || 'Invalid Coupon');
      }
  }

  const handleBook = () => {
    if (!user) {
      navigate('/login');
      return;
    }


    navigate('/payment', {
      state: {
        eventId: id,
        tickets,
        totalPrice: discountedPrice,
        eventTitle: event.title
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div
          className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );

  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div
          className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div
            className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops!
          </h2>
          <p className="text-gray-500 mb-6">
            {error || 'Event not found'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Back to Home
          </button>
        </div>
      </div>
    );

  }

  const isSoldOut = event.availableTickets <= 0;
  const totalPrice = tickets * event.pricePerTicket;
  const discountAmount = (totalPrice * discountPercentage) / 100;
  const discountedPrice = totalPrice - discountAmount;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="relative h-[40vh] md:h-[50vh] bg-gray-900">
        {event.image ?
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover opacity-70" /> :

        <div
          className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-900 to-purple-900">
          <svg
            className="w-24 h-24 text-white/20"
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
          className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent" />
        <button
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 md:top-8 md:left-8 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div
              className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-indigo-900/5 border border-indigo-50">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span
                  className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
                  {event.category}
                </span>
                {isSoldOut &&
                <span
                  className="bg-red-50 text-red-600 border border-red-100 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
                  Sold Out
                </span>}
              </div>
              <h1
                className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                {event.title}
              </h1>
              <div
                className="flex flex-wrap gap-y-4 gap-x-8 py-6 border-y border-gray-100 mb-8">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Date
                    </p>
                    <p className="font-bold text-gray-900">
                      {new Date(event.startDate).toLocaleDateString()}
                      {" - "}
                      {new Date(event.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Location
                    </p>
                    <p className="font-bold text-gray-900">
                      {event.city || 'Kerala'}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  About this event
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>
              <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Full Location Details
                </h4>
                <p className="text-gray-600">
                  {event.location}
                </p>
              </div>
            </div>
            {event.subEvents?.length > 0 &&
            <div
              className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-indigo-900/5 border border-indigo-50">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Event Schedule / Sessions
              </h3>
              <div className="space-y-6">
                {event.subEvents.map((sub, index) =>
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-indigo-200 transition-colors group">
                  <div className="sm:w-32 shrink-0 font-medium">
                    <span
                      className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1.5 rounded-lg text-sm block text-center sm:text-left sm:inline-block">
                      {sub.time}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row gap-6">
                    {sub.image &&
                    <div className="shrink-0">
                      <img
                        src={sub.image}
                        alt={sub.title}
                        className="w-full sm:w-32 h-32 sm:h-24 object-cover rounded-xl shadow-sm group-hover:shadow-md transition-shadow" />
                    </div>}
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {sub.title}
                      </h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
                        {sub.speaker &&
                        <p
                          className="text-indigo-700 flex items-center gap-1.5 text-sm font-semibold">
                          <svg
                            className="w-4 h-4 text-indigo-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {sub.speaker}
                        </p>}
                        {sub.location &&
                        <p className="text-gray-600 flex items-center gap-1.5 text-sm font-medium">
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
                          {sub.location}
                        </p>}
                      </div>
                      {sub.description &&
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {sub.description}
                      </p>}
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>}
          </div>
          <div className="lg:col-span-1">
            <div
              className="sticky top-8 bg-white rounded-3xl p-8 shadow-2xl shadow-indigo-900/10 border border-indigo-50">
              <div className="mb-6 pb-6 border-b border-gray-100 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-gray-900">
                  ₹
                  {event.pricePerTicket}
                </span>
                <span className="text-gray-500 font-medium">
                  / ticket
                </span>
              </div>
              {!isSoldOut ?
              <React.Fragment>
                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-2">
                    <label className="font-bold text-gray-700">
                      Quantity
                    </label>
                    <span className="text-indigo-600 font-medium">
                      {event.availableTickets}
                      {" left"}
                    </span>
                  </div>
                  <div
                    className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                    <button
                      onClick={() => setTickets(Math.max(1, tickets - 1))}
                      className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-white rounded-lg transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={event.availableTickets}
                      value={tickets}
                      onChange={(e) => setTickets(Math.max(1, Math.min(event.availableTickets, Number(e.target.value))))}
                      className="flex-1 text-center bg-transparent border-0 text-lg font-bold text-gray-900 focus:ring-0 appearance-none m-0" />
                    <button
                      onClick={() => setTickets(Math.min(event.availableTickets, tickets + 1))}
                      className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-white rounded-lg transition">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl mb-8 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>
                      ₹
                      {event.pricePerTicket}
                      {" x "}
                      {tickets}
                    </span>
                    <span className="font-medium">
                      ₹
                      {totalPrice}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Service Fee
                    </span>
                    <span className="text-green-600 font-medium text-sm">
                      ₹0 for you!
                    </span>
                  </div>
                  <div
                    className="pt-3 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-lg">
                    <span>
                      Total
                    </span>
                    <span>
                      ₹
                      {discountedPrice}
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Have a coupon?</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={couponCode} 
                            onChange={(e) => setCouponCode(e.target.value)} 
                            className="w-full flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none uppercase" 
                            placeholder="Enter Code" 
                        />
                        <button 
                            onClick={applyCoupon}
                            className="px-4 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition">
                            Apply
                        </button>
                    </div>
                    {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
                    {couponSuccess && <p className="text-green-600 font-bold text-sm mt-2">{couponSuccess}</p>}
                </div>

                <button
                  onClick={handleBook}
                  disabled={isBooking || tickets > event.availableTickets}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl text-lg font-bold transition shadow-lg shadow-indigo-200 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  {isBooking ?
                  <React.Fragment>
                    <div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </React.Fragment> :

                  'Secure Your Spot'}
                </button>
                <p
                  className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure transaction
                </p>
              </React.Fragment> :

              <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <h3 className="text-xl font-bold mb-1">
                  Tickets Sold Out
                </h3>
                <p className="text-sm opacity-80">
                  Check back later for cancellations
                </p>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}