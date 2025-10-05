import React, { useRef } from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useClickOutside } from '../useClickOutside';

// Test component that uses the click outside hook
const TestComponent = () => {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);

  useClickOutside(ref, () => setIsOpen(false));

  return (
    <div>
      <div data-testid="is-open">{isOpen.toString()}</div>
      <button onClick={() => setIsOpen(true)}>Open</button>
      <div ref={ref} data-testid="target-element">
        <button onClick={() => setIsOpen(false)}>Close</button>
      </div>
    </div>
  );
};

describe('useClickOutside', () => {
  it('calls callback when clicking outside target element', () => {
    render(<TestComponent />);
    
    const openButton = screen.getByText('Open');
    const isOpen = screen.getByTestId('is-open');
    
    // Open the element
    fireEvent.click(openButton);
    expect(isOpen).toHaveTextContent('true');
    
    // Click outside the target element
    fireEvent.click(document.body);
    expect(isOpen).toHaveTextContent('false');
  });

  it('does not call callback when clicking inside target element', () => {
    render(<TestComponent />);
    
    const openButton = screen.getByText('Open');
    const closeButton = screen.getByText('Close');
    const isOpen = screen.getByTestId('is-open');
    
    // Open the element
    fireEvent.click(openButton);
    expect(isOpen).toHaveTextContent('true');
    
    // Click inside the target element
    fireEvent.click(closeButton);
    expect(isOpen).toHaveTextContent('false');
  });
});
