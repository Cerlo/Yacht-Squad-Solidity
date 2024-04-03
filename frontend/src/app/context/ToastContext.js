import React, { createContext, useContext, useState } from 'react';
import Toast from '@/app/components/Toast/Toast';

const ToastContext = createContext();
/**
 * @notice Accesses the toast context provided by the `ToastProvider`.
 * @return Returns an object containing functions to show and hide toast notifications.
 */
export const useToast = () => useContext(ToastContext);

/**
 * @notice Initializes the `ToastProvider` component, setting up the toast notification context.
 * @param children The child components that will consume the toast notification context.
 */
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, type: '', title: '', message: '' });

  /**
   * @notice Triggers the display of a toast notification with the specified type, title, and message.
   * @param type The type of the toast notification (e.g., 'success', 'error').
   * @param title The title of the toast notification.
   * @param message The message of the toast notification.
   */
  const showToast = (type, title, message) => {
    setToast({ show: true, type, title, message });
  };

  /**
   * @notice Hides the currently displayed toast notification.
   */
  const hideToast = () => {
    setToast((prevState) => ({ ...prevState, show: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast.show && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};