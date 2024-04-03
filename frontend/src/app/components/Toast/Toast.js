

import './style.css';
import React, { useState, useEffect } from 'react';

const Toast = ({ type, title, message, toastTimer = 5000, onClose }) => {
    
  const [toastClass, setToastClass] = useState('');

  const backgroundClass = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const icon = type === 'success' ? '✅' : '❌'; // You can replace these with actual icons

  
  /**
   * @notice Manage the closure of the toast
   * 
   */
  const closeToast = () => {
    setToastClass('toast-hidden');
    setTimeout(() => {
      onClose(); 
    }, 500); 
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      closeToast(); // Close the toast after the specified time
    }, toastTimer);
  
    return () => clearTimeout(timer); // Clean up the timer
  }, [toastTimer]);

  

  return (
    <div className={`toast toast-top toast-end ${backgroundClass} ${toastClass} rounded-md `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className={`mr-2 ${textColor}`}>{icon}</span>
          <span className={`${textColor} font-bold`}>{ type === 'success' ? `Success - ${title}` : `Error - ${title}`} :</span> {/* Title in bold */}
          <span className={`ml-1 ${textColor}`}>{message}</span> {/* Message styled normally */}
        </div>
        <button className={`ml-4 ${textColor}`} onClick={closeToast}>&times;</button>
      </div>
    </div>
  );
};

export default Toast;
