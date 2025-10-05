import React from 'react';
import { render, screen, fireEvent } from '../../utils/testUtils';
import { ErrorProvider, useError } from '../ErrorContext';

// Test component that uses the error context
const TestComponent = () => {
  const { errors, addError, removeError, clearErrors } = useError();

  return (
    <div>
      <div data-testid="error-count">{errors.length}</div>
      <button onClick={() => addError('Test error')}>Add Error</button>
      <button onClick={() => removeError(0)}>Remove Error</button>
      <button onClick={clearErrors}>Clear Errors</button>
    </div>
  );
};

describe('ErrorContext', () => {
  it('provides error context to children', () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );
    
    expect(screen.getByTestId('error-count')).toHaveTextContent('0');
  });

  it('adds errors when addError is called', () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );
    
    const addButton = screen.getByText('Add Error');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('error-count')).toHaveTextContent('1');
  });

  it('removes errors when removeError is called', () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );
    
    const addButton = screen.getByText('Add Error');
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('error-count')).toHaveTextContent('2');
    
    const removeButton = screen.getByText('Remove Error');
    fireEvent.click(removeButton);
    
    expect(screen.getByTestId('error-count')).toHaveTextContent('1');
  });

  it('clears all errors when clearErrors is called', () => {
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );
    
    const addButton = screen.getByText('Add Error');
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('error-count')).toHaveTextContent('2');
    
    const clearButton = screen.getByText('Clear Errors');
    fireEvent.click(clearButton);
    
    expect(screen.getByTestId('error-count')).toHaveTextContent('0');
  });
});
