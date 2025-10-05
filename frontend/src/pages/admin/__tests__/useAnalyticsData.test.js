import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useAnalyticsData } from '../AdminAnalytics';
import { adminAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  adminAPI: {
    get: jest.fn()
  }
}));

// Test component that uses the analytics data hook
const TestComponent = () => {
  const {
    analyticsData,
    loading,
    error,
    fetchAnalyticsData,
    refreshData
  } = useAnalyticsData('7d');

  return (
    <div>
      <div data-testid="total-quizzes">{analyticsData?.totalQuizzes || 0}</div>
      <div data-testid="total-users">{analyticsData?.totalUsers || 0}</div>
      <div data-testid="total-attempts">{analyticsData?.totalAttempts || 0}</div>
      <div data-testid="average-score">{analyticsData?.averageScore || 0}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'No error'}</div>
      <button onClick={fetchAnalyticsData}>Fetch Data</button>
      <button onClick={refreshData}>Refresh Data</button>
    </div>
  );
};

describe('useAnalyticsData', () => {
  const mockAnalyticsData = {
    totalQuizzes: 120,
    totalUsers: 500,
    totalAttempts: 1500,
    averageScore: 75,
    quizPerformance: [
      { name: 'Quiz A', attempts: 150, avgScore: 82 },
      { name: 'Quiz B', attempts: 120, avgScore: 78 }
    ],
    userActivity: [
      { date: '2023-01-01', newUsers: 10, quizCompletions: 25 }
    ],
    categoryDistribution: [
      { name: 'Science', value: 30 },
      { name: 'History', value: 25 }
    ],
    difficultyBreakdown: [
      { name: 'Easy', value: 40 },
      { name: 'Medium', value: 45 }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    adminAPI.get.mockResolvedValue({ data: mockAnalyticsData });
  });

  it('provides analytics data state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('total-quizzes')).toHaveTextContent('0');
    expect(screen.getByTestId('total-users')).toHaveTextContent('0');
    expect(screen.getByTestId('total-attempts')).toHaveTextContent('0');
    expect(screen.getByTestId('average-score')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('No error');
  });

  it('handles fetchAnalyticsData action', async () => {
    render(<TestComponent />);
    
    const fetchButton = screen.getByText('Fetch Data');
    fireEvent.click(fetchButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(screen.getByTestId('total-quizzes')).toHaveTextContent('120');
      expect(screen.getByTestId('total-users')).toHaveTextContent('500');
      expect(screen.getByTestId('total-attempts')).toHaveTextContent('1500');
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
