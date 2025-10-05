import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((error, options = {}) => {
    const {
      showToast = true,
      toastMessage = null,
      logError = true,
      fallbackMessage = 'An unexpected error occurred',
      onError = null
    } = options;

    // Log error to console
    if (logError) {
      console.error('Error caught by useErrorHandler:', error);
    }

    // Set error state
    setError(error);

    // Show toast notification
    if (showToast) {
      const message = toastMessage || error?.message || fallbackMessage;
      toast.error(message);
    }

    // Call custom error handler
    if (onError) {
      onError(error);
    }

    // Log to external service if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error?.message || error?.toString() || 'Unknown error',
        fatal: false
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    error,
    handleError,
    clearError,
    hasError: !!error
  };
};

export default useErrorHandler;
