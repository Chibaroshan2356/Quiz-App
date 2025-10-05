// Global error handler for unhandled errors
class GlobalErrorHandler {
  constructor() {
    this.setupErrorHandlers();
  }

  setupErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleError(event.reason, 'UNHANDLED_PROMISE_REJECTION');
      event.preventDefault(); // Prevent the default browser behavior
    });

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      console.error('Uncaught error:', event.error);
      this.handleError(event.error, 'UNCAUGHT_ERROR');
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        console.error('Resource loading error:', event.target.src || event.target.href);
        this.handleError(new Error(`Resource loading failed: ${event.target.src || event.target.href}`), 'RESOURCE_LOADING_ERROR');
      }
    }, true);
  }

  handleError(error, type = 'UNKNOWN') {
    // Log error details
    const errorDetails = {
      message: error?.message || 'Unknown error',
      stack: error?.stack || '',
      type: type,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log to console
    console.error('Global error handler caught:', errorDetails);

    // Log to external service if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: errorDetails.message,
        fatal: true
      });
    }

    // Send to error reporting service if available
    if (window.errorReportingService) {
      window.errorReportingService.reportError(errorDetails);
    }

    // Show user-friendly error message
    this.showUserError(error);
  }

  showUserError(error) {
    // Create a simple error notification
    const errorMessage = this.getUserFriendlyMessage(error);
    
    // Show toast notification if available
    if (window.toast) {
      window.toast.error(errorMessage);
    } else {
      // Fallback to alert
      alert(`Error: ${errorMessage}`);
    }
  }

  getUserFriendlyMessage(error) {
    const message = error?.message || 'An unexpected error occurred';
    
    // Map technical errors to user-friendly messages
    if (message.includes('Network Error') || message.includes('fetch')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    if (message.includes('ChunkLoadError') || message.includes('Loading chunk')) {
      return 'The application has been updated. Please refresh the page.';
    }
    
    if (message.includes('Script error')) {
      return 'A script error occurred. Please refresh the page.';
    }
    
    if (message.includes('ResizeObserver loop limit exceeded')) {
      return 'A display issue occurred. The page will continue to work normally.';
    }
    
    return 'An unexpected error occurred. Please refresh the page or contact support if the problem persists.';
  }

  // Method to manually report errors
  reportError(error, context = {}) {
    const errorDetails = {
      message: error?.message || 'Unknown error',
      stack: error?.stack || '',
      type: 'MANUAL_REPORT',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      context: context
    };

    console.error('Manual error report:', errorDetails);

    // Send to error reporting service if available
    if (window.errorReportingService) {
      window.errorReportingService.reportError(errorDetails);
    }
  }
}

// Create and export singleton instance
const globalErrorHandler = new GlobalErrorHandler();

// Export for manual error reporting
export const reportError = (error, context) => {
  globalErrorHandler.reportError(error, context);
};

// Export the handler instance
export default globalErrorHandler;
