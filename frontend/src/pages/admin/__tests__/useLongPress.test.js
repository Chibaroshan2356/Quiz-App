import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useLongPress } from '../useLongPress';

// Test component that uses the long press hook
const TestComponent = () => {
  const [count, setCount] = React.useState(0);

  const longPressProps = useLongPress(() => {
    setCount(count + 1);
  }, 1000);

  return (
    <div>
      <div data-testid="count">{count}</div>
      <button {...longPressProps} data-testid="long-press-button">Long Press Me</button>
    </div>
  );
};

describe('useLongPress', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('executes callback after long press', async () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    const longPressButton = screen.getByTestId('long-press-button');
    
    // Start long press
    fireEvent.mouseDown(longPressButton);
    
    // Fast-forward time by 1000ms
    jest.advanceTimersByTime(1000);
    
    // Callback should have executed
    await waitFor(() => {
      expect(count).toHaveTextContent('1');
    });
  });

  it('does not execute callback on short press', () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    const longPressButton = screen.getByTestId('long-press-button');
    
    // Start and end press quickly
    fireEvent.mouseDown(longPressButton);
    fireEvent.mouseUp(longPressButton);
    
    // Fast-forward time by 1000ms
    jest.advanceTimersByTime(1000);
    
    // Count should remain 0
    expect(count).toHaveTextContent('0');
  });
});
