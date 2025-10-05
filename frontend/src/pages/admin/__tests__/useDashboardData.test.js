import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useDashboardData } from '../AdminDashboard';
import { adminAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  adminAPI: {
    get: jest.fn()
  }
}));

// Test component that uses the dashboard data hook
const TestComponent = () => {
  const {
    dashboardData,
    loading,
    error,
    fetchDashboardData,
    refreshData
  } = useDashboardData();

  return (
    <div>
      <div data-testid="total-quizzes">{dashboardData?.totalQuizzes || 0}</div>
      <div data-testid="total-users">{dashboardData?.totalUsers || 0}</div>
      <div data-testid="total-attempts">{dashboardData?.totalAttempts || 0}</div>
      <div data-testid="average-score">{dashboardData?.averageScore || 0}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'No error'}</div>
      <button onClick={fetchDashboardData}>Fetch Data</button>
      <button onClick={refreshData}>Refresh Data</button>
    </div>
  );
};

describe('useDashboardData', () => {
  const mockDashboardData = {
    totalQuizzes: 10,
    totalUsers: 50,
    totalAttempts: 100,
    averageScore: 75
  };

  beforeEach(() => {
    jest.clearAllMocks();
    adminAPI.get.mockResolvedValue({ data: mockDashboardData });
  });

  it('provides dashboard data state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('total-quizzes')).toHaveTextContent('0');
    expect(screen.getByTestId('total-users')).toHaveTextContent('0');
    expect(screen.getByTestId('total-attempts')).toHaveTextContent('0');
    expect(screen.getByTestId('average-score')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('No error');
  });

  it('handles fetchDashboardData action', async () => {
    render(<TestComponent />);
    
    const fetchButton = screen.getByText('Fetch Data');
    fireEvent.click(fetchButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(screen.getByTestId('total-quizzes')).toHaveTextContent('10');
      expect(screen.getByTestId('total-users')).toHaveTextContent('50');
      expect(screen.getByTestId('total-attempts')).toHaveTextContent('100');
      expect(screen.getByTestId('average-score')).toHaveTextContent('75');
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
