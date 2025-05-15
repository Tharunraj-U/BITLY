
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './module/login'
import Register from './module/register'
import Home from './module/home'

import NavBar from './module/NavBar'
import About from './module/About'
import Analytics from './module/Analytics'
import { useSelector } from 'react-redux'
import ProtectComponent from './module/ProtectComponent'
import Fingerprint from '@mui/icons-material/Fingerprint';
import IconButton from '@mui/material/IconButton';
import { logout } from './store/authSlice'
import { useDispatch } from 'react-redux'
import { Avatar } from '@mui/material'
import { deepOrange } from '@mui/material/colors';
function App() {
  
   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
   const dispatch = useDispatch();

   const logOut = () => {
     dispatch(logout());
   }
  return (
    <BrowserRouter>
      {isLoggedIn &&  <NavBar/> }
      {isLoggedIn && 
      <IconButton aria-label="fingerprint" color="success">
      <Fingerprint onClick={() => {logOut()}} />
      </IconButton>

       }
       <ProtectComponent > <Avatar sx={{ bgcolor: deepOrange[500] }}>N</Avatar>   </ProtectComponent>
      <Routes>
        <Route path="/"  element={<Login />} />
        <Route path="/register" element={ <Register />  } />
        <Route path="/home" element={ <ProtectComponent><Home /></ProtectComponent>} />
        <Route path="/analytics" element={<ProtectComponent><Analytics /> </ProtectComponent>} />
        <Route path="/about" element={<ProtectComponent><About /></ProtectComponent>} />
        
      
      </Routes>
    </BrowserRouter>
  )
}

export default App
