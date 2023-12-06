// src/app/components/Header.js
'use client'
import React, { useState, useEffect } from 'react';
import CustomConnectButton from './CustomConnectButton';

const Header = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <nav className="flex items-center justify-between p-4 bg-lessDark text-white">
      <div className="flex items-center">
        <img src="/csv-logo.svg" alt="CSV Logo" className="h-12 mr-2" />
        <span className="text-lg font-bold text-gold">YachtSquad</span>
      </div>

      <div className="hidden md:flex space-x-4">
        <a href="/" className="text-white hover:text-gold">Home</a>
        <a href="/about" className="text-white hover:text-gold">About</a>
        <a href="/contact" className="text-white hover:text-gold">Contact</a>
      </div>

      <div>
        {loading ? (
          <button className="px-4 py-2 bg-gold text-white border-gold hover:bg-dark hover:text-gold">
            Loading...
          </button>
        ) : (
          <CustomConnectButton />
        )}
      </div>
    </nav>
  );
};

export default Header;