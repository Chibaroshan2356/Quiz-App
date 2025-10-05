import '../globalErrorHandler';

describe('globalErrorHandler', () => {
  let consoleSpy;
  let toastSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    toastSpy = jest.fn();
    
    // Mock react-hot-toast
    jest.doMock('react-hot-toast', () => ({
      toast: {
        error: toastSpy
      }
    }));
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('handles unhandled promise rejections', () => {
    const error = new Error('Unhandled promise rejection');
    const event = new Event('unhandledrejection');
    event.reason = error;

    window.dispatchEvent(event);

    expect(consoleSpy).toHaveBeenCalledWith('Unhandled promise rejection:', error);
  });

  it('handles uncaught exceptions', () => {
    const error = new Error('Uncaught exception');
    const event = new Event('error');
    event.error = error;
    event.filename = 'test.js';
    event.lineno = 10;
    event.colno = 5;

    window.dispatchEvent(event);

    expect(consoleSpy).toHaveBeenCalledWith(
      'Uncaught exception:',
      error,
      'test.js',
      10,
      5
    );
  });

  it('ignores errors marked as handled by error boundary', () => {
    const error = new Error('Handled error');
    error.isHandledByErrorBoundary = true;
    const event = new Event('error');
    event.error = error;

    window.dispatchEvent(event);

    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
