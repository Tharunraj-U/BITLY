import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './module/Register'
import { useState } from 'react'
import Home from './module/home'
import NavBar from './module/NavBar'
import About from './module/About'
import { useSelector, useDispatch } from 'react-redux'
import ProtectComponent from './module/ProtectComponent'
import { logout } from './store/authSlice'
import './index.css'
import Login from './module/login'
import NotFound from './module/NotFound'

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(logout());
  }

  return (
    <BrowserRouter>
      {isLoggedIn && <NavBar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProtectComponent><Home /></ProtectComponent>} />
        <Route path="/about" element={<ProtectComponent><About /></ProtectComponent>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
