import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useThrottleRef } from '../useThrottleRef';

// Test component that uses the throttle ref hook
const TestComponent = () => {
  const [count, setCount] = useState(0);
  const throttledCountRef = useThrottleRef(count, 1000);

  return (
    <div>
      <div data-testid="count">{count}</div>
      <div data-testid="throttled-count">{throttledCountRef.current}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

describe('useThrottleRef', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('throttles ref updates', () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    const throttledCount = screen.getByTestId('throttled-count');
    const incrementButton = screen.getByText('Increment');
    
    // Initial state
    expect(count).toHaveTextContent('0');
    expect(throttledCount).toHaveTextContent('0');
    
    // Increment multiple times quickly
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    
    // Count should be 3, but throttled count should still be 0
    expect(count).toHaveTextContent('3');
    expect(throttledCount).toHaveTextContent('0');
    
    // Fast-forward time by 1000ms
    jest.advanceTimersByTime(1000);
    
    // Throttled count should now be 3
    expect(throttledCount).toHaveTextContent('3');
  });
});