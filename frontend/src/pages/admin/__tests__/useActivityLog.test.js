import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useActivityLog } from '../ActivityLog';
import { adminAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  adminAPI: {
    get: jest.fn()
  }
}));

// Test component that uses the activity log hook
const TestComponent = () => {
  const {
    activities,
    loading,
    error,
    fetchActivities,
    refreshData
  } = useActivityLog();

  return (
    <div>
      <div data-testid="activity-count">{activities.length}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'No error'}</div>
      <button onClick={fetchActivities}>Fetch Activities</button>
      <button onClick={refreshData}>Refresh Data</button>
    </div>
  );
};

describe('useActivityLog', () => {
  const mockActivities = [
    { id: 1, action: 'User created', user: 'John Doe', timestamp: '2023-01-01T10:00:00Z' },
    { id: 2, action: 'Quiz published', user: 'Jane Smith', timestamp: '2023-01-01T11:00:00Z' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    adminAPI.get.mockResolvedValue({ data: mockActivities });
  });

  it('provides activity log state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('activity-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('No error');
  });

  it('handles fetchActivities action', async () => {
    render(<TestComponent />);
    
    const fetchButton = screen.getByText('Fetch Activities');
    fireEvent.click(fetchButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(screen.getByTestId('activity-count')).toHaveTextContent('2');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  it('handles refreshData action', async () => {
    render(<TestComponent />);
    
    const refreshButton = screen.getByText('Refresh Data');
    fireEvent.click(refreshButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });
});
