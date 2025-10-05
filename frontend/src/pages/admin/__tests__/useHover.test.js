import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useHover } from '../useHover';

// Test component that uses the hover hook
const TestComponent = () => {
  const [hoverRef, isHovered] = useHover();

  return (
    <div>
      <div data-testid="is-hovered">{isHovered.toString()}</div>
      <div ref={hoverRef} data-testid="hover-target">Hover me</div>
    </div>
  );
};

describe('useHover', () => {
  it('provides hover state and ref', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('is-hovered')).toHaveTextContent('false');
  });

  it('detects mouse enter', () => {
    render(<TestComponent />);
    
    const hoverTarget = screen.getByTestId('hover-target');
    const isHovered = screen.getByTestId('is-hovered');
    
    fireEvent.mouseEnter(hoverTarget);
    expect(isHovered).toHaveTextContent('true');
  });

  it('detects mouse leave', () => {
    render(<TestComponent />);
    
    const hoverTarget = screen.getByTestId('hover-target');
    const isHovered = screen.getByTestId('is-hovered');
    
    // Enter first
    fireEvent.mouseEnter(hoverTarget);
    expect(isHovered).toHaveTextContent('true');
    
    // Leave
    fireEvent.mouseLeave(hoverTarget);
    expect(isHovered).toHaveTextContent('false');
  });
});
