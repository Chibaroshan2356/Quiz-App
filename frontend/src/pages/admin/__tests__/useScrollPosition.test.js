import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useScrollPosition } from '../useScrollPosition';

// Test component that uses the scroll position hook
const TestComponent = () => {
  const { x, y, direction } = useScrollPosition();

  return (
    <div>
      <div data-testid="scroll-x">{x}</div>
      <div data-testid="scroll-y">{y}</div>
      <div data-testid="scroll-direction">{direction}</div>
    </div>
  );
};

describe('useScrollPosition', () => {
  beforeEach(() => {
    // Mock window.scrollX and window.scrollY
    Object.defineProperty(window, 'scrollX', {
      writable: true,
      value: 0
    });
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 0
    });
  });

  it('provides scroll position', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('scroll-x')).toHaveTextContent('0');
    expect(screen.getByTestId('scroll-y')).toHaveTextContent('0');
    expect(screen.getByTestId('scroll-direction')).toHaveTextContent('down');
  });

  it('tracks scroll changes', () => {
    render(<TestComponent />);
    
    // Simulate scroll
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 100
    });
    
    fireEvent.scroll(window);
    
    expect(screen.getByTestId('scroll-y')).toHaveTextContent('100');
  });
});
