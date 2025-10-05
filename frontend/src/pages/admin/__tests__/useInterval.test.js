import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useInterval } from '../useInterval';

// Test component that uses the interval hook
const TestComponent = () => {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useInterval(() => {
    setCount(count + 1);
  }, 1000, isActive);

  return (
    <div>
      <div data-testid="count">{count}</div>
      <div data-testid="is-active">{isActive.toString()}</div>
      <button onClick={() => setIsActive(true)}>Start Interval</button>
      <button onClick={() => setIsActive(false)}>Stop Interval</button>
    </div>
  );
};

describe('useInterval', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('executes callback at intervals when active', async () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    const isActive = screen.getByTestId('is-active');
    const startButton = screen.getByText('Start Interval');
    
    // Initial state
    expect(count).toHaveTextContent('0');
    expect(isActive).toHaveTextContent('false');
    
    // Start interval
    fireEvent.click(startButton);
    expect(isActive).toHaveTextContent('true');
    
    // Fast-forward time by 1000ms
    jest.advanceTimersByTime(1000);
    
    // Callback should have executed once
    await waitFor(() => {
      expect(count).toHaveTextContent('1');
    });
    
    // Fast-forward time by another 1000ms
    jest.advanceTimersByTime(1000);
    
    // Callback should have executed again
    await waitFor(() => {
      expect(count).toHaveTextContent('2');
    });
  });

  it('stops executing callback when inactive', async () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    const isActive = screen.getByTestId('is-active');
    const startButton = screen.getByText('Start Interval');
    const stopButton = screen.getByText('Stop Interval');
    
    // Start interval
    fireEvent.click(startButton);
    expect(isActive).toHaveTextContent('true');
    
    // Fast-forward time by 1000ms
    jest.advanceTimersByTime(1000);
    
    // Callback should have executed once
    await waitFor(() => {
      expect(count).toHaveTextContent('1');
    });
    
    // Stop interval
    fireEvent.click(stopButton);
    expect(isActive).toHaveTextContent('false');
    
    // Fast-forward time by another 1000ms
    jest.advanceTimersByTime(1000);
    
    // Count should remain 1
    expect(count).toHaveTextContent('1');
  });
});
