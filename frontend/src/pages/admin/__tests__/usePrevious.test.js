import React, { useState } from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { usePrevious } from '../usePrevious';

// Test component that uses the previous value hook
const TestComponent = () => {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div>
      <div data-testid="current-count">{count}</div>
      <div data-testid="previous-count">{previousCount}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

describe('usePrevious', () => {
  it('provides previous value', () => {
    render(<TestComponent />);
    
    const currentCount = screen.getByTestId('current-count');
    const previousCount = screen.getByTestId('previous-count');
    
    // Initial state
    expect(currentCount).toHaveTextContent('0');
    expect(previousCount).toHaveTextContent('undefined');
    
    // Increment count
    const incrementButton = screen.getByText('Increment');
    fireEvent.click(incrementButton);
    
    expect(currentCount).toHaveTextContent('1');
    expect(previousCount).toHaveTextContent('0');
    
    // Increment again
    fireEvent.click(incrementButton);
    
    expect(currentCount).toHaveTextContent('2');
    expect(previousCount).toHaveTextContent('1');
  });
});
