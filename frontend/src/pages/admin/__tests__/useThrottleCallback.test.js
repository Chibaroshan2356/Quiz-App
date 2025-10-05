import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useThrottleCallback } from '../useThrottleCallback';

// Test component that uses the throttle callback hook
const TestComponent = () => {
  const [count, setCount] = useState(0);
  const [throttledCount, setThrottledCount] = useState(0);

  const throttledIncrement = useThrottleCallback(() => {
    setThrottledCount(throttledCount + 1);
  }, 1000);

  return (
    <div>
      <div data-testid="count">{count}</div>
      <div data-testid="throttled-count">{throttledCount}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={throttledIncrement}>Throttled Increment</button>
    </div>
  );
};

describe('useThrottleCallback', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('throttles callback execution', () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    const throttledCount = screen.getByTestId('throttled-count');
    const throttledIncrementButton = screen.getByText('Throttled Increment');
    
    // Initial state
    expect(count).toHaveTextContent('0');
    expect(throttledCount).toHaveTextContent('0');
    
    // Call throttled function multiple times quickly
    fireEvent.click(throttledIncrementButton);
    fireEvent.click(throttledIncrementButton);
    fireEvent.click(throttledIncrementButton);
    
    // Throttled count should still be 0
    expect(throttledCount).toHaveTextContent('0');
    
    // Fast-forward time by 1000ms
    jest.advanceTimersByTime(1000);
    
    // Throttled count should now be 1
    expect(throttledCount).toHaveTextContent('1');
  });
});