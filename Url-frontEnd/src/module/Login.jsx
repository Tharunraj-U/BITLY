import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { motion } from 'framer-motion';

const Login = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!user.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!user.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendData = async () => {
    try {
      setIsSubmitting(true);
      const res = await axios.post('https://bitly-latest.onrender.com/api/auth/login', user);
      const token = res.data.token;
      localStorage.setItem('token', JSON.stringify(token));
      dispatch(login(token));
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const storedToken = JSON.parse(localStorage.getItem('token'));
    if (storedToken) dispatch(login(storedToken));
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) navigate('/home');
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await sendData();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      <motion.div
        className="relative w-full max-w-md p-8 mx-6 bg-white bg-opacity-10 rounded-2xl backdrop-blur-xl shadow-xl border border-white border-opacity-20"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Glowing blobs */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-200">Login to access your dashboard</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="p-3 text-sm text-red-100 bg-red-900 bg-opacity-40 rounded-md border border-red-700">
              {errors.submit}
            </div>
          )}

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={user.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-800 bg-opacity-50 text-gray-100 border ${
                errors.email ? 'border-red-500' : 'border-gray-700'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm text-gray-200 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={user.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-800 bg-opacity-50 text-gray-100 border ${
                errors.password ? 'border-red-500' : 'border-gray-700'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition transform hover:-translate-y-1"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Bottom Links */}
          <div className="flex justify-between text-sm text-gray-300">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox text-purple-500" />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline hover:text-purple-300">
              Forgot password?
            </a>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-300">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium">
            Register now
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
