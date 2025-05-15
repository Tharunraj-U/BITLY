
import React, { useEffect, useState } from 'react';
import { Sparkles, ExternalLink, ChevronRight, Star, Shield, Zap, Code } from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white p-4 md:p-8 flex flex-col justify-center items-center font-sans overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-yellow-500 rounded-full filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Main content */}
      <div className={`max-w-4xl w-full text-center z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header section with enhanced animation */}
        <div className="relative flex justify-center mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 blur-md opacity-30 animate-pulse"></div>
          <Sparkles size={56} className="text-yellow-400 relative z-10" />
        </div>
        
        <h1 className="text-5xl font-bold mb-4 relative inline-block">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">Shrinky</span>
          <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full"></div>
        </h1>
        
        <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
          Shrinky is a sleek, secure, and smart URL shortener. Built with the goal of making long links shareable,
          our service empowers users to transform complex URLs into clean, elegant short links that make sharing effortless.
        </p>
        
        {/* Features section with improved cards and animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mb-12">
          <FeatureCard 
            icon={<Star className="text-yellow-400" />}
            title="Simplicity First"
            description="Our design is user-first, avoiding clutter and providing a frictionless experience that respects your workflow."
            delay="0ms"
          />
          <FeatureCard 
            icon={<Zap className="text-yellow-400" />}
            title="Fast Redirects"
            description="Experience blazing-fast link redirects optimized for performance and reliability across all devices."
            delay="200ms"
          />
          <FeatureCard 
            icon={<Shield className="text-yellow-400" />}
            title="Privacy Focused"
            description="We never track unnecessary data and respect your privacy with end-to-end security practices."
            delay="400ms"
          />
          <FeatureCard 
            icon={<Code className="text-yellow-400" />}
            title="Dev Friendly"
            description="API access allows seamless integration for developers and businesses looking to scale."
            delay="600ms"
          />
        </div>
        
        {/* Stats section */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <StatCard number="5M+" label="Links Created" />
          <StatCard number="99.9%" label="Uptime" />
          <StatCard number="0.3s" label="Avg Redirect" />
        </div>
        
        {/* CTA section with enhanced button */}
        <div className="mb-16">
          <button className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-black font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 flex items-center mx-auto group">
            Get Started
            <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <a href="#" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mt-4 transition-colors">
            <span>View documentation</span>
            <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
        
        {/* Testimonial */}
      
        
        {/* Footer */}
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Shrinky | Crafted with 
          <span className="mx-1 text-red-500">❤️</span> 
          by Tharun Raj 
          <span className="ml-1 text-yellow-500">👑</span>
        </p>
      </div>
    </div>
  );
};

// Feature card component with animation
const FeatureCard = ({ icon, title, description, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, parseInt(delay || '0'));
    
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-yellow-500/30 transition-all duration-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="flex items-center mb-3">
        {icon}
        <h2 className="text-xl font-semibold ml-2 text-yellow-300">{title}</h2>
      </div>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

// Stat card component
const StatCard = ({ number, label }) => {
  return (
    <div className="text-center px-4">
      <p className="text-3xl font-bold text-yellow-400 mb-1">{number}</p>
      <p className="text-sm text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
  );
};

export default About;