// Error reporting service for collecting and sending error data
class ErrorReportingService {
  constructor() {
    this.errors = [];
    this.maxErrors = 100; // Maximum number of errors to store locally
    this.batchSize = 10; // Number of errors to send in one batch
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  // Add error to the queue
  reportError(errorDetails) {
    // Add error to local storage
    this.errors.push(errorDetails);
    
    // Trim errors if we exceed the maximum
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Try to send errors immediately
    this.sendErrors();
  }

  // Send errors to the server
  async sendErrors() {
    if (this.errors.length === 0) return;

    const errorsToSend = this.errors.splice(0, this.batchSize);
    
    try {
      await this.sendToServer(errorsToSend);
      console.log('Errors sent to server successfully');
    } catch (error) {
      console.error('Failed to send errors to server:', error);
      
      // Put errors back in the queue for retry
      this.errors.unshift(...errorsToSend);
      
      // Retry after delay
      setTimeout(() => {
        this.sendErrors();
      }, this.retryDelay);
    }
  }

  // Send errors to server
  async sendToServer(errors) {
    const response = await fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        errors: errors,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
        userId: this.getUserId()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Get session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('errorReportingSessionId');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem('errorReportingSessionId', sessionId);
    }
    return sessionId;
  }

  // Get user ID if available
  getUserId() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.id || null;
    } catch {
      return null;
    }
  }

  // Generate session ID
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get error statistics
  getErrorStats() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentErrors = this.errors.filter(error => 
      new Date(error.timestamp) > last24Hours
    );

    const errorTypes = recentErrors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {});

    return {
      totalErrors: this.errors.length,
      recentErrors: recentErrors.length,
      errorTypes: errorTypes,
      lastError: this.errors[this.errors.length - 1]?.timestamp
    };
  }

  // Clear all errors
  clearErrors() {
    this.errors = [];
  }

  // Export errors for debugging
  exportErrors() {
    return {
      errors: this.errors,
      stats: this.getErrorStats(),
      timestamp: new Date().toISOString()
    };
  }
}

// Create and export singleton instance
const errorReportingService = new ErrorReportingService();

// Make it available globally for the global error handler
if (typeof window !== 'undefined') {
  window.errorReportingService = errorReportingService;
}

export default errorReportingService;
