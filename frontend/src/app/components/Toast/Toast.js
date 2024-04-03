

import './style.css';
import React, { useState, useEffect } from 'react';

/**
 * @notice Initializes the Toast component with default or provided props.
 * @param type The type of toast, which can be 'success' or any other value for error. Determines the styling of the toast.
 * @param title The title of the toast message, typically indicating the nature of the notification.
 * @param message The detailed message to be displayed within the toast.
 * @param toastTimer (Optional) The duration in milliseconds for which the toast should be visible before auto-closing. Defaults to 5000ms.
 * @param onClose A callback function to execute when the toast is closed.
*/
const Toast = ({ type, title, message, toastTimer = 5000, onClose }) => {
    
  const [toastClass, setToastClass] = useState('');

  const backgroundClass = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const icon = type === 'success' ? '✅' : '❌'; // You can replace these with actual icons

  
  /**
   * @notice Triggers the close operation for the toast and executes the onClose callback after a short delay.
   * @dev Sets the CSS class to hide the toast and ensures the onClose callback is executed only after the CSS transition completes.
  */
  const closeToast = () => {
    setToastClass('toast-hidden');
    setTimeout(() => {
      onClose(); 
    }, 500); 
  };

  /**
   * @notice Sets up a timer to automatically close the toast after a specified duration.
   * @dev Utilizes useEffect to manage the lifecycle of the toast's visibility. Clears the timeout on component unmount to prevent memory leaks.
  */
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
