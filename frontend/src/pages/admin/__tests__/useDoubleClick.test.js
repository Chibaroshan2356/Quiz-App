import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useDoubleClick } from '../useDoubleClick';

// Test component that uses the double click hook
const TestComponent = () => {
  const [count, setCount] = React.useState(0);

  const doubleClickProps = useDoubleClick(() => {
    setCount(count + 1);
  }, 300);

  return (
    <div>
      <div data-testid="count">{count}</div>
      <button {...doubleClickProps} data-testid="double-click-button">Double Click Me</button>
    </div>
  );
};

describe('useDoubleClick', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('executes callback on double click', () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    const doubleClickButton = screen.getByTestId('double-click-button');
    
    // Double click
    fireEvent.click(doubleClickButton);
    fireEvent.click(doubleClickButton);
    
    expect(count).toHaveTextContent('1');
  });

  it('does not execute callback on single click', () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    const doubleClickButton = screen.getByTestId('double-click-button');
    
    // Single click
    fireEvent.click(doubleClickButton);
    
    // Fast-forward time by 300ms
    jest.advanceTimersByTime(300);
    
    // Count should remain 0
    expect(count).toHaveTextContent('0');
  });
});
