import React from 'react';
import { render, screen } from '../../../utils/testUtils';
import { useIdle } from '../useIdle';

// Test component that uses the idle hook
const TestComponent = () => {
  const { isIdle, lastActive } = useIdle(5000);

  return (
    <div>
      <div data-testid="is-idle">{isIdle.toString()}</div>
      <div data-testid="last-active">{lastActive ? lastActive.toString() : 'No activity'}</div>
    </div>
  );
};

describe('useIdle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('provides idle state', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('is-idle')).toHaveTextContent('false');
  });

  it('becomes idle after timeout', () => {
    render(<TestComponent />);
    
    // Fast-forward time by 5000ms
    jest.advanceTimersByTime(5000);
    
    expect(screen.getByTestId('is-idle')).toHaveTextContent('true');
  });
});
