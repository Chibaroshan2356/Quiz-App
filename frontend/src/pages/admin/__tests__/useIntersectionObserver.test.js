import React from 'react';
import { render, screen } from '../../../utils/testUtils';
import { useIntersectionObserver } from '../useIntersectionObserver';

// Test component that uses the intersection observer hook
const TestComponent = () => {
  const [ref, isIntersecting] = useIntersectionObserver();

  return (
    <div>
      <div data-testid="is-intersecting">{isIntersecting.toString()}</div>
      <div ref={ref} data-testid="target-element">Target Element</div>
    </div>
  );
};

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn()
    }));
  });

  it('provides intersection observer state and ref', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('is-intersecting')).toHaveTextContent('false');
    expect(screen.getByTestId('target-element')).toBeInTheDocument();
  });

  it('creates intersection observer with ref', () => {
    render(<TestComponent />);
    
    expect(global.IntersectionObserver).toHaveBeenCalled();
  });
});
