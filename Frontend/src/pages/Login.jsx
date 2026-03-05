import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ setUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      let finalEmail = form.email.trim();
      if (finalEmail.toLowerCase() === 'admin') {
        finalEmail = 'admin@eventhub.com';
      }

      const endpoint = isRegister ? '/register' : '/login';
      const payload = isRegister ?
      { name: form.name, email: finalEmail, password: form.password, role: 'user' } :
      { email: finalEmail, password: form.password };

      const res = await axios.post(`http://localhost:5000/api/auth${endpoint}`, payload);
      if (!isRegister) {
        setUser(res.data.user);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
      <div
        className="hidden md:flex md:w-1/2 relative bg-indigo-900 border-r border-indigo-800">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop')] opacity-30 bg-cover bg-center mix-blend-overlay" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-10">
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            {"Discover Your Next "}
            <br />
            Great Experience.
          </h2>
          <p className="text-indigo-200 text-lg max-w-md">
            Join thousands of others in finding the best events, exhibitions, and festivals near you.
          </p>
        </div>
      </div>
      <div
        className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left mb-10">
            <Link
              to="/"
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
              Back to Home
            </Link>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {isRegister ? 'Create Account' : 'Welcome back'}
            </h2>
            <p className="mt-3 text-gray-500 text-lg">
              {isRegister ?
              'Sign up to start booking your tickets.' :
              'Enter your details to access your account.'}
            </p>
          </div>
          {error &&
          <div
            className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
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
            <span className="text-sm font-medium">
              {error}
            </span>
          </div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister &&
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required={true}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent focus:bg-white transition-all sm:text-sm"
                  placeholder="John Doe" />
              </div>
            </div>}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  name="email"
                  type="text"
                  value={form.email}
                  onChange={handleChange}
                  required={true}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent focus:bg-white transition-all sm:text-sm"
                  placeholder="you@example.com (or 'admin')" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required={true}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent focus:bg-white transition-all sm:text-sm"
                  placeholder={"\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"} />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ?
              <div
                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :

              isRegister ? 'Create Account' : 'Sign in'}
            </button>
          </form>
          <div
            className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center">
            <p className="text-gray-600">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              {' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition ml-1">
                {isRegister ? 'Sign in instead' : 'Create an account'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

}