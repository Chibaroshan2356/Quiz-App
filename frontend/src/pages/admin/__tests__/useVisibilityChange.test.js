import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useVisibilityChange } from '../useVisibilityChange';

// Test component that uses the visibility change hook
const TestComponent = () => {
  const { isVisible, visibilityCount } = useVisibilityChange();

  return (
    <div>
      <div data-testid="is-visible">{isVisible.toString()}</div>
      <div data-testid="visibility-count">{visibilityCount}</div>
    </div>
  );
};

describe('useVisibilityChange', () => {
  beforeEach(() => {
    // Mock document.visibilityState
    Object.defineProperty(document, 'visibilityState', {
      writable: true,
      value: 'visible'
    });
  });

  it('provides visibility state', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('is-visible')).toHaveTextContent('true');
    expect(screen.getByTestId('visibility-count')).toHaveTextContent('0');
  });

  it('tracks visibility changes', () => {
    render(<TestComponent />);
    
    // Simulate visibility change
    Object.defineProperty(document, 'visibilityState', {
      writable: true,
      value: 'hidden'
    });
    
    fireEvent(document, new Event('visibilitychange'));
    
    expect(screen.getByTestId('is-visible')).toHaveTextContent('false');
    expect(screen.getByTestId('visibility-count')).toHaveTextContent('1');
  });
});
