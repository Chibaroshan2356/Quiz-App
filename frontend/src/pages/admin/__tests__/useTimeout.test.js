import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useTimeout } from '../useTimeout';

// Test component that uses the timeout hook
const TestComponent = () => {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useTimeout(() => {
    setCount(count + 1);
    setIsActive(false);
  }, 1000, isActive);

  return (
    <div>
      <div data-testid="count">{count}</div>
      <div data-testid="is-active">{isActive.toString()}</div>
      <button onClick={() => setIsActive(true)}>Start Timeout</button>
    </div>
  );
};

describe('useTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('executes callback after timeout', async () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    const isActive = screen.getByTestId('is-active');
    const startButton = screen.getByText('Start Timeout');
    
    // Initial state
    expect(count).toHaveTextContent('0');
    expect(isActive).toHaveTextContent('false');
    
    // Start timeout
    fireEvent.click(startButton);
    expect(isActive).toHaveTextContent('true');
    
    // Fast-forward time by 1000ms
    jest.advanceTimersByTime(1000);
    
    // Callback should have executed
    await waitFor(() => {
      expect(count).toHaveTextContent('1');
      expect(isActive).toHaveTextContent('false');
    });
  });

  it('does not execute callback when not active', () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    
    // Fast-forward time by 1000ms without starting timeout
    jest.advanceTimersByTime(1000);
    
    // Count should remain 0
    expect(count).toHaveTextContent('0');
  });
});
