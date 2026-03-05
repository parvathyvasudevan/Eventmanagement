import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Payment({ user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, tickets, totalPrice, eventTitle } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');


  if (!eventId || !tickets) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Valid Checkout Session Required
        </h2>
        <Link to="/" className="text-indigo-600 font-bold hover:underline">
          Return to Events
        </Link>
      </div>
    );

  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // 1. Create order on the backend
      const { data: responseData } = await axios.post(
        'http://localhost:5000/api/bookings/create-razorpay-order',
        { amount: totalPrice },
        { withCredentials: true }
      );
      
      const { order, razorpayKeyId } = responseData;

      // 2. Initialize Razorpay options
      const options = {
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Event Booking',
        description: `Tickets for ${eventTitle}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify signature on the backend and finalize booking
            const verifyRes = await axios.post(
              'http://localhost:5000/api/bookings/verify-razorpay-signature',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                eventId,
                tickets,
                totalPrice
              },
              { withCredentials: true }
            );

            // 4. Redirect on ultimate success
            navigate('/thank-you', {
              state: {
                bookingId: verifyRes.data.booking._id,
                eventTitle,
                tickets,
                totalPrice
              }
            });
          } catch (verifyErr) {
            setError(verifyErr.response?.data?.msg || 'Payment verification failed.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || 'Guest User',
          email: user?.email || '',
        },
        theme: {
          color: '#4f46e5' // Indigo-600
        }
      };

      // 5. Open Razorpay Widget
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setError(response.error.description || 'Payment Failed');
        setIsProcessing(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to initialize payment gateway.');
      setIsProcessing(false);
    }
  };

  const paymentOptions = [
  { id: 'card', name: 'Credit / Debit Card', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg> },
  { id: 'upi', name: 'UPI', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg> },
  { id: 'gpay', name: 'Google Pay', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
  </svg> },
  { id: 'paytm', name: 'Paytm', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg> },
  { id: 'bank', name: 'Net Banking', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg> }];


  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <Link
            to={`/event/${eventId}`}
            className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition mb-6">
            <svg
              className="w-5 h-5 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Event
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Secure Checkout
          </h1>
          <p className="mt-3 text-gray-500 text-lg">
            Select your preferred payment method.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 grid grid-cols-2 md:grid-cols-5 gap-2">
              {paymentOptions.map((option) =>
              <button
                key={option.id}
                onClick={() => setPaymentMethod(option.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                paymentMethod === option.id ?
                'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-inner' :
                'text-gray-500 hover:bg-gray-50 border border-transparent hover:border-gray-200'}`}>
                <div
                  className={`mb-1.5 ${paymentMethod === option.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {option.icon}
                </div>
                <span className="text-xs font-bold text-center leading-tight">
                  {option.name}
                </span>
              </button>
              )}
            </div>
            <div
              className="bg-white rounded-3xl shadow-xl shadow-indigo-900/5 p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span
                  className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  2
                </span>
                Payment Details
              </h2>
              {error &&
              <div
                className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-medium flex items-center gap-2">
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>}
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {paymentMethod === 'card' &&
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      required={true}
                      placeholder={user?.name || "Jane Doe"}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required={true}
                        placeholder="0000 0000 0000 0000"
                        maxLength="19"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 font-medium tracking-widest outline-none" />
                      <svg
                        className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required={true}
                        placeholder="MM/YY"
                        maxLength="5"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 font-medium text-center outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        CVC
                      </label>
                      <input
                        type="password"
                        required={true}
                        placeholder={"\u2022\u2022\u2022"}
                        maxLength="4"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 font-medium text-center tracking-widest outline-none" />
                    </div>
                  </div>
                </div>}
                {(paymentMethod === 'upi' || paymentMethod === 'gpay' || paymentMethod === 'paytm') &&
                <div
                  className="space-y-6 flex flex-col items-center justify-center py-6 animate-fadeIn">
                  <div
                    className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div className="w-full max-w-sm">
                    <label className="block text-sm font-bold text-gray-700 mb-2 text-center">
                      {"Enter your "}
                      {paymentMethod.toUpperCase()}
                      {" ID"}
                    </label>
                    <input
                      type="text"
                      required={true}
                      placeholder="username@upi"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 font-medium text-center outline-none" />
                  </div>
                  <p className="text-gray-500 text-sm text-center">
                    A payment request will be sent to your UPI app.
                  </p>
                </div>}
                {paymentMethod === 'bank' &&
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Select Your Bank
                    </label>
                    <select
                      required={true}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-gray-900 font-medium outline-none cursor-pointer">
                      <option value="">
                        Choose a bank...
                      </option>
                      <option value="sbi">
                        State Bank of India
                      </option>
                      <option value="hdfc">
                        HDFC Bank
                      </option>
                      <option value="icici">
                        ICICI Bank
                      </option>
                      <option value="axis">
                        Axis Bank
                      </option>
                      <option value="kotak">
                        Kotak Mahindra Bank
                      </option>
                    </select>
                  </div>
                  <div
                    className="p-4 bg-yellow-50 text-yellow-800 rounded-xl text-sm border border-yellow-200">
                    You will be redirected to your bank's secure portal to complete this transaction via Net Banking.
                  </div>
                </div>}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed group">
                  {isProcessing ?
                  <React.Fragment>
                    <div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Payment...
                  </React.Fragment> :

                  <React.Fragment>
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Securely Pay ₹
                    {totalPrice}
                  </React.Fragment>}
                </button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div
              className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-3xl p-8 text-white shadow-xl sticky top-8 border border-gray-800">
              <h3
                className="text-xl font-bold mb-6 text-indigo-400 uppercase tracking-widest text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Summary
              </h3>
              <div className="mb-6 pb-6 border-b border-white/10">
                <p className="font-extrabold text-2xl mb-2 leading-tight">
                  {eventTitle || 'Event Ticket'}
                </p>
                <div className="flex items-center gap-3 text-indigo-200 mt-4">
                  <span
                    className="bg-indigo-500/30 px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-sm shadow-inner">
                    {tickets}
                    x
                  </span>
                  <span className="font-medium text-sm">
                    General Admission
                  </span>
                </div>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-indigo-100/80 text-sm">
                  <span>
                    Subtotal
                  </span>
                  <span className="font-medium">
                    ₹
                    {totalPrice}
                  </span>
                </div>
                <div className="flex justify-between text-indigo-100/80 text-sm">
                  <span>
                    Service Fee
                  </span>
                  <span className="text-green-400 font-bold tracking-wide">
                    FREE
                  </span>
                </div>
                <div className="flex justify-between text-indigo-100/80 text-sm">
                  <span>
                    Tax
                  </span>
                  <span className="font-medium">
                    ₹0
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-end pt-6 border-t border-white/10">
                <span className="text-lg text-indigo-200 font-medium">
                  Total Due
                </span>
                <span className="text-4xl font-extrabold tracking-tight">
                  ₹
                  {totalPrice}
                </span>
              </div>
              <div className="mt-8 flex items-center justify-center gap-4 opacity-60">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v2.93zM17.9 17.39c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                <span className="text-xs font-semibold tracking-wider">
                  SECURE 256-BIT ENCRYPTION
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}