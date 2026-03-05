import { useLocation, Link, Navigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';

export default function ThankYou() {
  const location = useLocation();
  const { bookingId, eventTitle, tickets, totalPrice } = location.state || {};

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!bookingId) {
    return <Navigate to="/" />;
  }

  return (
    <div
      className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.15} />
      <div
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl shadow-indigo-900/10 p-8 md:p-12 text-center relative z-10 border border-indigo-50">
        <div
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <svg
            className="w-12 h-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1
          className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto">
          You're all set! Your tickets have been secured and a confirmation email has been sent to you.
        </p>
        <div
          className="bg-gray-50 rounded-2xl p-6 md:p-8 text-left mb-10 border border-gray-100 shadow-sm">
          <h3
            className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            Booking Details
          </h3>
          <div className="space-y-4">
            <div
              className="flex justify-between items-start border-b border-gray-200 pb-4">
              <span className="text-gray-500 font-medium">
                Event
              </span>
              <span className="text-gray-900 font-bold text-right max-w-[200px]">
                {eventTitle}
              </span>
            </div>
            <div
              className="flex justify-between items-center border-b border-gray-200 pb-4">
              <span className="text-gray-500 font-medium">
                Tickets
              </span>
              <span
                className="text-gray-900 font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg">
                {tickets}
                x General Admission
              </span>
            </div>
            <div
              className="flex justify-between items-center border-b border-gray-200 pb-4">
              <span className="text-gray-500 font-medium">
                Order ID
              </span>
              <span className="text-gray-900 font-mono text-sm">
                {bookingId}
              </span>
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-indigo-600 font-bold">
                Total Paid
              </span>
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                ₹
                {totalPrice}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/my-bookings"
            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex-1 sm:flex-none">
            View My Bookings
          </Link>
          <Link
            to="/"
            className="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 border border-gray-200 transition shadow-sm flex-1 sm:flex-none">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );

}