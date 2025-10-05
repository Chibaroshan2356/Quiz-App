import React from 'react';
import { render, screen } from '../../../utils/testUtils';
import { useNetworkStatus } from '../useNetworkStatus';

// Test component that uses the network status hook
const TestComponent = () => {
  const { isOnline, isOffline, connectionType } = useNetworkStatus();

  return (
    <div>
      <div data-testid="is-online">{isOnline.toString()}</div>
      <div data-testid="is-offline">{isOffline.toString()}</div>
      <div data-testid="connection-type">{connectionType || 'Unknown'}</div>
    </div>
  );
};

describe('useNetworkStatus', () => {
  beforeEach(() => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });

    // Mock navigator.connection
    Object.defineProperty(navigator, 'connection', {
      writable: true,
      value: {
        effectiveType: '4g'
      }
    });
  });

  it('provides network status', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('is-online')).toHaveTextContent('true');
    expect(screen.getByTestId('is-offline')).toHaveTextContent('false');
    expect(screen.getByTestId('connection-type')).toHaveTextContent('4g');
  });
});
