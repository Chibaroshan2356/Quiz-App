import errorReportingService from '../errorReportingService';

describe('errorReportingService', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'groupEnd').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('logs errors with error info', () => {
    const error = new Error('Test error');
    const errorInfo = { component: 'TestComponent' };

    errorReportingService.logError(error, errorInfo);

    expect(consoleSpy).toHaveBeenCalledWith('Error Reported to Service');
    expect(console.error).toHaveBeenCalledWith('Error:', error);
    expect(console.info).toHaveBeenCalledWith('Error Info:', errorInfo);
  });

  it('logs errors without error info', () => {
    const error = new Error('Test error');

    errorReportingService.logError(error);

    expect(consoleSpy).toHaveBeenCalledWith('Error Reported to Service');
    expect(console.error).toHaveBeenCalledWith('Error:', error);
    expect(console.info).toHaveBeenCalledWith('Error Info:', {});
  });

  it('sets user context', () => {
    const user = { id: 1, email: 'test@example.com' };
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    errorReportingService.setUser(user);

    expect(consoleSpy).toHaveBeenCalledWith('Error reporting service: User set', user);
  });

  it('adds breadcrumbs', () => {
    const breadcrumb = { message: 'User clicked button', level: 'info' };
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    errorReportingService.addBreadcrumb(breadcrumb);

    expect(consoleSpy).toHaveBeenCalledWith('Error reporting service: Breadcrumb added', breadcrumb);
  });
});
