import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useMousePosition } from '../useMousePosition';

// Test component that uses the mouse position hook
const TestComponent = () => {
  const { x, y } = useMousePosition();

  return (
    <div>
      <div data-testid="mouse-x">{x}</div>
      <div data-testid="mouse-y">{y}</div>
    </div>
  );
};

describe('useMousePosition', () => {
  it('provides mouse position', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('mouse-x')).toHaveTextContent('0');
    expect(screen.getByTestId('mouse-y')).toHaveTextContent('0');
  });

  it('tracks mouse movement', () => {
    render(<TestComponent />);
    
    // Simulate mouse move
    fireEvent.mouseMove(window, { clientX: 100, clientY: 200 });
    
    expect(screen.getByTestId('mouse-x')).toHaveTextContent('100');
    expect(screen.getByTestId('mouse-y')).toHaveTextContent('200');
  });
});
