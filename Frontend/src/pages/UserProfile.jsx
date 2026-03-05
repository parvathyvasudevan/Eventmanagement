import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function UserProfile({ user }) {
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            Please log in to view your profile.
          </p>
          <Link
            to="/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition">
            Log In
          </Link>
        </div>
      </div>
    );

  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <nav
        className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-500 hover:text-indigo-600 transition p-2 -ml-2 rounded-full hover:bg-indigo-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            My Profile
          </h1>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div
          className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div
            className="h-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="px-8 pb-8 relative">
            <div className="absolute -top-16 left-8">
              <div
                className="w-32 h-32 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-indigo-600 text-5xl font-bold shadow-md">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <div className="pt-20">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-900">
                    {user.name}
                  </h2>
                  <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {user.email}
                  </p>
                </div>
                <div
                  className="px-4 py-1.5 bg-indigo-50 text-indigo-700 font-bold rounded-full text-sm uppercase tracking-wider border border-indigo-100">
                  {user.role}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/my-bookings"
            className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4 hover:border-indigo-200">
            <div
              className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <h3
                className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                My Bookings
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                View and manage all your purchased event tickets.
              </p>
            </div>
          </Link>
          {user.role === 'admin' &&
          <Link
            to="/admin"
            className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4 hover:border-pink-200">
            <div
              className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3
                className="font-bold text-gray-900 text-lg group-hover:text-pink-600 transition-colors">
                Admin Dashboard
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Create new events, manage sub-events, and oversee the platform.
              </p>
            </div>
          </Link>}
          <button
            onClick={() => {
              document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              window.location.href = '/login';
            }}
            className="col-span-1 md:col-span-full group bg-white rounded-2xl p-6 border border-red-100 shadow-sm hover:shadow-md transition-all flex items-start gap-4 hover:border-red-300">
            <div
              className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div className="text-left">
              <h3
                className="font-bold text-red-600 text-lg group-hover:text-red-700 transition-colors">
                Log Out
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Sign out of your account on this device.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

}