import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const ErrorContext = createContext();

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  CLIENT: 'CLIENT',
  UNKNOWN: 'UNKNOWN'
};

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

// Initial state
const initialState = {
  errors: [],
  isOnline: navigator.onLine,
  retryCount: 0
};

// Error reducer
const errorReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ERROR':
      return {
        ...state,
        errors: [...state.errors, {
          id: Date.now() + Math.random(),
          timestamp: new Date().toISOString(),
          ...action.payload
        }]
      };
    
    case 'REMOVE_ERROR':
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload)
      };
    
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: []
      };
    
    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        isOnline: action.payload
      };
    
    case 'INCREMENT_RETRY':
      return {
        ...state,
        retryCount: state.retryCount + 1
      };
    
    case 'RESET_RETRY':
      return {
        ...state,
        retryCount: 0
      };
    
    default:
      return state;
  }
};

// Error provider component
export const ErrorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState);

  // Add error
  const addError = useCallback((errorData) => {
    const error = {
      type: ERROR_TYPES.UNKNOWN,
      severity: ERROR_SEVERITY.MEDIUM,
      showToast: true,
      toastMessage: null,
      logError: true,
      retryable: false,
      ...errorData
    };

    // Log error to console
    if (error.logError) {
      console.error('Error added to context:', error);
    }

    // Show toast notification
    if (error.showToast) {
      const message = error.toastMessage || error.message || 'An error occurred';
      
      switch (error.severity) {
        case ERROR_SEVERITY.CRITICAL:
          toast.error(message, { duration: 10000 });
          break;
        case ERROR_SEVERITY.HIGH:
          toast.error(message, { duration: 7000 });
          break;
        case ERROR_SEVERITY.MEDIUM:
          toast.error(message, { duration: 5000 });
          break;
        case ERROR_SEVERITY.LOW:
          toast.warning(message, { duration: 3000 });
          break;
        default:
          toast.error(message);
      }
    }

    // Dispatch to reducer
    dispatch({ type: 'ADD_ERROR', payload: error });

    // Log to external service if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message || error.toString() || 'Unknown error',
        fatal: error.severity === ERROR_SEVERITY.CRITICAL
      });
    }
  }, []);

  // Remove error
  const removeError = useCallback((errorId) => {
    dispatch({ type: 'REMOVE_ERROR', payload: errorId });
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  // Handle API errors
  const handleApiError = useCallback((error, options = {}) => {
    let errorType = ERROR_TYPES.UNKNOWN;
    let severity = ERROR_SEVERITY.MEDIUM;
    let message = 'An error occurred';
    let retryable = false;

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      
      switch (status) {
        case 400:
          errorType = ERROR_TYPES.VALIDATION;
          severity = ERROR_SEVERITY.LOW;
          message = error.response.data?.message || 'Invalid request';
          break;
        case 401:
          errorType = ERROR_TYPES.AUTHENTICATION;
          severity = ERROR_SEVERITY.HIGH;
          message = 'Authentication required';
          break;
        case 403:
          errorType = ERROR_TYPES.AUTHORIZATION;
          severity = ERROR_SEVERITY.HIGH;
          message = 'Access denied';
          break;
        case 404:
          errorType = ERROR_TYPES.NOT_FOUND;
          severity = ERROR_SEVERITY.LOW;
          message = 'Resource not found';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorType = ERROR_TYPES.SERVER;
          severity = ERROR_SEVERITY.HIGH;
          message = 'Server error occurred';
          retryable = true;
          break;
        default:
          errorType = ERROR_TYPES.SERVER;
          severity = ERROR_SEVERITY.MEDIUM;
          message = error.response.data?.message || 'Server error';
      }
    } else if (error.request) {
      // Network error
      errorType = ERROR_TYPES.NETWORK;
      severity = ERROR_SEVERITY.HIGH;
      message = 'Network error - please check your connection';
      retryable = true;
    } else {
      // Client error
      errorType = ERROR_TYPES.CLIENT;
      severity = ERROR_SEVERITY.MEDIUM;
      message = error.message || 'An error occurred';
    }

    addError({
      type: errorType,
      severity,
      message,
      retryable,
      originalError: error,
      ...options
    });
  }, [addError]);

  // Handle network status changes
  const handleNetworkStatusChange = useCallback(() => {
    const isOnline = navigator.onLine;
    dispatch({ type: 'SET_ONLINE_STATUS', payload: isOnline });
    
    if (isOnline) {
      dispatch({ type: 'RESET_RETRY' });
      toast.success('Connection restored');
    } else {
      toast.error('Connection lost');
    }
  }, []);

  // Set up network status listeners
  React.useEffect(() => {
    window.addEventListener('online', handleNetworkStatusChange);
    window.addEventListener('offline', handleNetworkStatusChange);

    return () => {
      window.removeEventListener('online', handleNetworkStatusChange);
      window.removeEventListener('offline', handleNetworkStatusChange);
    };
  }, [handleNetworkStatusChange]);

  // Retry mechanism
  const retry = useCallback((retryFunction) => {
    if (state.retryCount < 3) {
      dispatch({ type: 'INCREMENT_RETRY' });
      return retryFunction();
    } else {
      addError({
        type: ERROR_TYPES.CLIENT,
        severity: ERROR_SEVERITY.HIGH,
        message: 'Maximum retry attempts reached',
        showToast: true
      });
      return Promise.reject(new Error('Maximum retry attempts reached'));
    }
  }, [state.retryCount, addError]);

  const value = {
    ...state,
    addError,
    removeError,
    clearErrors,
    handleApiError,
    retry,
    ERROR_TYPES,
    ERROR_SEVERITY
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

// Hook to use error context
export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export default ErrorContext;
