import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice'; // ✅ import the correct action
import { Link } from 'react-router-dom';

const Login = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // ✅ get state from Redux

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const sendData = async () => {
    const res = await axios.post('http://localhost:8080/api/auth/login', user);
    const token = res.data.token;

    // Save token and update Redux state
    localStorage.setItem('token', JSON.stringify(token));
    dispatch(login(token));
  };

  useEffect(() => {
    // Auto-login if token exists
    const storedToken = JSON.parse(localStorage.getItem('token'));
    if (storedToken) {
      dispatch(login(storedToken));
    }
  }, [dispatch]);

  useEffect(() => {
    // Navigate on login success
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await sendData();
          } catch (err) {
            alert('Login failed');
            console.error(err);
          }
        }}
      >
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
        </p>
    </div>
  );
};

export default Login;
