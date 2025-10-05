import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useToggle } from '../useToggle';

// Test component that uses the toggle hook
const TestComponent = () => {
  const [isOpen, toggle, open, close] = useToggle(false);

  return (
    <div>
      <div data-testid="is-open">{isOpen.toString()}</div>
      <button onClick={toggle}>Toggle</button>
      <button onClick={open}>Open</button>
      <button onClick={close}>Close</button>
    </div>
  );
};

describe('useToggle', () => {
  it('provides toggle state and functions', () => {
    render(<TestComponent />);
    
    const isOpen = screen.getByTestId('is-open');
    
    // Initial state
    expect(isOpen).toHaveTextContent('false');
    
    // Toggle
    const toggleButton = screen.getByText('Toggle');
    fireEvent.click(toggleButton);
    expect(isOpen).toHaveTextContent('true');
    
    // Toggle again
    fireEvent.click(toggleButton);
    expect(isOpen).toHaveTextContent('false');
  });

  it('opens when open is called', () => {
    render(<TestComponent />);
    
    const isOpen = screen.getByTestId('is-open');
    const openButton = screen.getByText('Open');
    
    // Initial state
    expect(isOpen).toHaveTextContent('false');
    
    // Open
    fireEvent.click(openButton);
    expect(isOpen).toHaveTextContent('true');
  });

  it('closes when close is called', () => {
    render(<TestComponent />);
    
    const isOpen = screen.getByTestId('is-open');
    const openButton = screen.getByText('Open');
    const closeButton = screen.getByText('Close');
    
    // Open first
    fireEvent.click(openButton);
    expect(isOpen).toHaveTextContent('true');
    
    // Close
    fireEvent.click(closeButton);
    expect(isOpen).toHaveTextContent('false');
  });
});
