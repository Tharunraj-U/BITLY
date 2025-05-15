import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, useActionData } from 'react-router-dom';

const ProtectComponent = ({children}) => {
    const isAuthenticated = useSelector((state) => state.auth.isLoggedIn);
  return (
    <div>{
        isAuthenticated ? (
            children
        ) : (
            <Navigate to="/" replace />
        )
    }   
      
    </div>
  )
}

export default ProtectComponent
