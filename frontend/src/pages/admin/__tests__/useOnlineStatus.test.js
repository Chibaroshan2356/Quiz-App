import React from 'react';
import { render, screen } from '../../../utils/testUtils';
import { useOnlineStatus } from '../useOnlineStatus';

// Test component that uses the online status hook
const TestComponent = () => {
  const { isOnline, isOffline } = useOnlineStatus();

  return (
    <div>
      <div data-testid="is-online">{isOnline.toString()}</div>
      <div data-testid="is-offline">{isOffline.toString()}</div>
    </div>
  );
};

describe('useOnlineStatus', () => {
  beforeEach(() => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });
  });

  it('provides online status when online', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('is-online')).toHaveTextContent('true');
    expect(screen.getByTestId('is-offline')).toHaveTextContent('false');
  });

  it('provides offline status when offline', () => {
    // Mock navigator.onLine as false
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('is-online')).toHaveTextContent('false');
    expect(screen.getByTestId('is-offline')).toHaveTextContent('true');
  });
});
