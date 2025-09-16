import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tokenUtils } from '../config/api';

const TokenExpirationHandler: React.FC = () => {
  const { state, logout, isTokenExpired } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeUntilExpiration, setTimeUntilExpiration] = useState<number>(0);

  useEffect(() => {
    if (!state.token || !state.isAuthenticated) {
      setShowWarning(false);
      return;
    }

    const updateExpirationTime = () => {
      const timeLeft = tokenUtils.getTimeUntilExpiration(state.token);
      setTimeUntilExpiration(timeLeft);

      // Show warning if token expires in less than 5 minutes (300000 ms)
      const fiveMinutes = 5 * 60 * 1000;
      setShowWarning(timeLeft > 0 && timeLeft <= fiveMinutes);
    };

    // Update immediately
    updateExpirationTime();

    // Update every 30 seconds
    const interval = setInterval(updateExpirationTime, 30000);

    return () => clearInterval(interval);
  }, [state.token, state.isAuthenticated]);

  const formatTimeLeft = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDismiss = () => {
    setShowWarning(false);
  };

  const handleLogout = () => {
    logout();
    setShowWarning(false);
  };

  if (!showWarning || isTokenExpired()) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Session Expiring Soon
          </h3>
          <p className="mt-1 text-sm text-yellow-700">
            Your session will expire in {formatTimeLeft(timeUntilExpiration)}.
            You'll be automatically logged out.
          </p>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleDismiss}
              className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200 transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={handleLogout}
              className="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 transition-colors"
            >
              Logout Now
            </button>
          </div>
        </div>
        <div className="ml-3 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="inline-flex text-yellow-400 hover:text-yellow-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenExpirationHandler;