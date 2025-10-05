import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useSettings } from '../Settings';
import { adminAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  adminAPI: {
    get: jest.fn(),
    put: jest.fn()
  }
}));

// Test component that uses the settings hook
const TestComponent = () => {
  const {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
    saveSettings
  } = useSettings();

  return (
    <div>
      <div data-testid="site-name">{settings?.siteName || ''}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'No error'}</div>
      <button onClick={fetchSettings}>Fetch Settings</button>
      <button onClick={() => updateSettings({ siteName: 'Updated Site' })}>Update Settings</button>
      <button onClick={saveSettings}>Save Settings</button>
    </div>
  );
};

describe('useSettings', () => {
  const mockSettings = {
    siteName: 'Test Site',
    siteDescription: 'Test Description',
    adminEmail: 'admin@test.com'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    adminAPI.get.mockResolvedValue({ data: mockSettings });
    adminAPI.put.mockResolvedValue({ data: mockSettings });
  });

  it('provides settings state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('site-name')).toHaveTextContent('');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('No error');
  });

  it('handles fetchSettings action', async () => {
    render(<TestComponent />);
    
    const fetchButton = screen.getByText('Fetch Settings');
    fireEvent.click(fetchButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(screen.getByTestId('site-name')).toHaveTextContent('Test Site');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  it('handles updateSettings action', () => {
    render(<TestComponent />);
    
    const updateButton = screen.getByText('Update Settings');
    fireEvent.click(updateButton);
    
    expect(screen.getByTestId('site-name')).toHaveTextContent('Updated Site');
  });

  it('handles saveSettings action', async () => {
    render(<TestComponent />);
    
    const saveButton = screen.getByText('Save Settings');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(adminAPI.put).toHaveBeenCalled();
    });
  });
});
