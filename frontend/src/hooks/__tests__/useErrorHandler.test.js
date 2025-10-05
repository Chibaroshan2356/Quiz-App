import React from 'react';
import { render, screen, fireEvent } from '../../utils/testUtils';
import { ErrorProvider } from '../../contexts/ErrorContext';
import useErrorHandler from '../useErrorHandler';

// Test component that uses the error handler
const TestComponent = () => {
  const handleError = useErrorHandler();

  const triggerError = () => {
    handleError(new Error('Test error'), { component: 'TestComponent' });
  };

  return (
    <div>
      <button onClick={triggerError}>Trigger Error</button>
    </div>
  );
};

describe('useErrorHandler', () => {
  it('provides error handler function', () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );
    
    expect(screen.getByText('Trigger Error')).toBeInTheDocument();
  });

  it('handles errors when called', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );
    
    const triggerButton = screen.getByText('Trigger Error');
    fireEvent.click(triggerButton);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Caught by useErrorHandler:',
      expect.any(Error),
      { component: 'TestComponent' }
    );
    
    consoleSpy.mockRestore();
  });
});