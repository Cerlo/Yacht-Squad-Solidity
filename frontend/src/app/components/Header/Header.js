import React, { useState, useEffect } from 'react';
import CustomConnectButton from './CustomConnectButton';
import { useAuth } from '@/app/context/AuthContext';

const Header = () => {
  const [loading, setLoading] = useState(true);
  const { userType } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="flex justify-end p-1 bg-dark text-white">
        {loading ? (
          <button className="px-4 py-2 bg-gold text-white border border-gold hover:bg-dark hover:text-gold">
            Loading...
          </button>
        ) : (
          <CustomConnectButton />
        )}
      </div>
      <nav className="flex items-center justify-between p-4 bg-lessDark text-white">
        <div className="flex items-center justify-start">
          <img src="/csv-logo.svg" alt="CSV Logo" className="h-12 mr-2" />
          <span className="text-lg font-bold text-gold">YachtSquad</span>
        </div>

        <div className="flex-2 text-center">
          <a href="/" className="mx-4 text-white hover:text-gold">Home</a>
          <a href="/about" className="mx-4 text-white hover:text-gold">About</a>
          <a href="/contact" className="mx-4 text-white hover:text-gold">Contact</a>
          {userType === 'owner' && <a href="/mint" className="mx-4 text-white hover:text-gold">Mint</a>}
          {userType === 'owner' && <a href="/mint" className="mx-4 text-white hover:text-gold">Change status</a>}
          {userType === 'investor' && <a href="/mint" className="mx-4 text-white hover:text-gold">Dashboard</a>}
        </div>

        <div className="flex-1"></div> 
      </nav>
    </>
  );
};

export default Header;
