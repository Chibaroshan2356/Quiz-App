import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useThrottleEffect } from '../useThrottleEffect';

// Test component that uses the throttle effect hook
const TestComponent = () => {
  const [count, setCount] = useState(0);
  const [effectCount, setEffectCount] = useState(0);

  useThrottleEffect(() => {
    setEffectCount(effectCount + 1);
  }, [count], 1000);

  return (
    <div>
      <div data-testid="count">{count}</div>
      <div data-testid="effect-count">{effectCount}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

describe('useThrottleEffect', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('throttles effect execution', () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    const effectCount = screen.getByTestId('effect-count');
    const incrementButton = screen.getByText('Increment');
    
    // Initial state
    expect(count).toHaveTextContent('0');
    expect(effectCount).toHaveTextContent('0');
    
    // Increment multiple times quickly
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    
    // Count should be 3, but effect count should still be 0
    expect(count).toHaveTextContent('3');
    expect(effectCount).toHaveTextContent('0');
    
    // Fast-forward time by 1000ms
    jest.advanceTimersByTime(1000);
    
    // Effect count should now be 1
    expect(effectCount).toHaveTextContent('1');
  });
});