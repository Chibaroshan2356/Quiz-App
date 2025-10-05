import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useCounter } from '../useCounter';

// Test component that uses the counter hook
const TestComponent = () => {
  const { count, increment, decrement, reset, setCount } = useCounter(0);

  return (
    <div>
      <div data-testid="count">{count}</div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
      <button onClick={() => setCount(10)}>Set to 10</button>
    </div>
  );
};

describe('useCounter', () => {
  it('provides counter state and functions', () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    
    // Initial state
    expect(count).toHaveTextContent('0');
    
    // Increment
    const incrementButton = screen.getByText('Increment');
    fireEvent.click(incrementButton);
    expect(count).toHaveTextContent('1');
    
    // Increment again
    fireEvent.click(incrementButton);
    expect(count).toHaveTextContent('2');
  });

  it('decrements count when decrement is called', () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    const incrementButton = screen.getByText('Increment');
    const decrementButton = screen.getByText('Decrement');
    
    // Increment first
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    expect(count).toHaveTextContent('2');
    
    // Decrement
    fireEvent.click(decrementButton);
    expect(count).toHaveTextContent('1');
    
    // Decrement again
    fireEvent.click(decrementButton);
    expect(count).toHaveTextContent('0');
  });

  it('resets count when reset is called', () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    const incrementButton = screen.getByText('Increment');
    const resetButton = screen.getByText('Reset');
    
    // Increment first
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    expect(count).toHaveTextContent('2');
    
    // Reset
    fireEvent.click(resetButton);
    expect(count).toHaveTextContent('0');
  });

  it('sets count to specific value when setCount is called', () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    const setCountButton = screen.getByText('Set to 10');
    
    // Set count to 10
    fireEvent.click(setCountButton);
    expect(count).toHaveTextContent('10');
  });
});
