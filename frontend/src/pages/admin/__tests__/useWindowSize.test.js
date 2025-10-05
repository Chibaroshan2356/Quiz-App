import React from 'react';
import { render, screen } from '../../../utils/testUtils';
import { useWindowSize } from '../useWindowSize';

// Test component that uses the window size hook
const TestComponent = () => {
  const { width, height } = useWindowSize();

  return (
    <div>
      <div data-testid="width">{width}</div>
      <div data-testid="height">{height}</div>
    </div>
  );
};

describe('useWindowSize', () => {
  beforeEach(() => {
    // Mock window.innerWidth and window.innerHeight
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768
    });
  });

  it('provides window size dimensions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('width')).toHaveTextContent('1024');
    expect(screen.getByTestId('height')).toHaveTextContent('768');
  });
});
