import React from 'react';
import { render, screen } from '../../../utils/testUtils';
import { useGeolocation } from '../useGeolocation';

// Test component that uses the geolocation hook
const TestComponent = () => {
  const { latitude, longitude, error, loading } = useGeolocation();

  return (
    <div>
      <div data-testid="latitude">{latitude || 'No latitude'}</div>
      <div data-testid="longitude">{longitude || 'No longitude'}</div>
      <div data-testid="error">{error || 'No error'}</div>
      <div data-testid="loading">{loading.toString()}</div>
    </div>
  );
};

describe('useGeolocation', () => {
  beforeEach(() => {
    // Mock navigator.geolocation
    Object.defineProperty(navigator, 'geolocation', {
      writable: true,
      value: {
        getCurrentPosition: jest.fn()
      }
    });
  });

  it('provides geolocation state', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('latitude')).toHaveTextContent('No latitude');
    expect(screen.getByTestId('longitude')).toHaveTextContent('No longitude');
    expect(screen.getByTestId('error')).toHaveTextContent('No error');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });
});
