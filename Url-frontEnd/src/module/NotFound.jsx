import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  
  // Animation for particles
  const particleCount = 30;
  const particles = Array.from({ length: particleCount });
  
  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      navigate('/');
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, navigate]);
  
  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-center px-4">
      {/* Animated particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white opacity-80"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: Math.random() * 6 + 2 + 'px',
            height: Math.random() * 6 + 2 + 'px',
          }}
        />
      ))}
      
      {/* 404 Text */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 inline-block transform -rotate-12 mr-4"
          >
            4
          </motion.div>
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-300 to-purple-400 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-purple-900 flex items-center justify-center relative">
                <motion.div 
                  className="absolute w-2 h-6 bg-blue-300 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
          <motion.div
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 inline-block transform rotate-12 ml-4"
          >
            4
          </motion.div>
        </div>
        
        <motion.h1 
          className="text-3xl md:text-4xl font-bold mt-8 text-white"
          animate={{ 
            y: [0, -5, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          Oops! Page Not Found
        </motion.h1>
        
        <motion.p 
          className="text-blue-200 mt-4 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          The page you're looking for seems to have vanished into the digital void. Perhaps it's on vacation?
        </motion.p>
        
        <div className="mt-8 space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.6 
            }}
          >
            <button
              onClick={() => navigate(-1)}
              className="bg-white text-purple-900 font-medium px-6 py-3 rounded-lg hover:bg-opacity-90 transform transition hover:-translate-y-1 shadow-lg mx-2"
            >
              Go Back
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transform transition hover:-translate-y-1 shadow-lg mx-2"
            >
              Go Home
            </button>
          </motion.div>
          
          <motion.p 
            className="text-blue-200 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Redirecting to homepage in {countdown} seconds...
          </motion.p>
        </div>
      </motion.div>
      
      {/* Decorative circle gradients */}
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full opacity-20 blur-xl"></div>
    </div>
  );
};

export default NotFound;