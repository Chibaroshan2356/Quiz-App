import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useDebounce } from '../useDebounce';

// Test component that uses the debounce hook
const TestComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const debouncedValue = useDebounce(inputValue, 500);

  return (
    <div>
      <input
        data-testid="input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type something..."
      />
      <div data-testid="debounced-value">{debouncedValue}</div>
    </div>
  );
};

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debounces input value changes', async () => {
    render(<TestComponent />);
    
    const input = screen.getByTestId('input');
    const debouncedValue = screen.getByTestId('debounced-value');
    
    // Type multiple characters quickly
    fireEvent.change(input, { target: { value: 'h' } });
    fireEvent.change(input, { target: { value: 'he' } });
    fireEvent.change(input, { target: { value: 'hel' } });
    fireEvent.change(input, { target: { value: 'hell' } });
    fireEvent.change(input, { target: { value: 'hello' } });
    
    // Debounced value should still be empty
    expect(debouncedValue).toHaveTextContent('');
    
    // Fast-forward time by 500ms
    jest.advanceTimersByTime(500);
    
    // Now debounced value should be updated
    await waitFor(() => {
      expect(debouncedValue).toHaveTextContent('hello');
    });
  });

  it('resets debounce timer on new input', async () => {
    render(<TestComponent />);
    
    const input = screen.getByTestId('input');
    const debouncedValue = screen.getByTestId('debounced-value');
    
    // Type first character
    fireEvent.change(input, { target: { value: 'h' } });
    
    // Fast-forward time by 400ms (less than 500ms)
    jest.advanceTimersByTime(400);
    
    // Type another character
    fireEvent.change(input, { target: { value: 'he' } });
    
    // Fast-forward time by 400ms again
    jest.advanceTimersByTime(400);
    
    // Debounced value should still be empty
    expect(debouncedValue).toHaveTextContent('');
    
    // Fast-forward time by another 100ms to complete the debounce
    jest.advanceTimersByTime(100);
    
    // Now debounced value should be updated
    await waitFor(() => {
      expect(debouncedValue).toHaveTextContent('he');
    });
  });
});
