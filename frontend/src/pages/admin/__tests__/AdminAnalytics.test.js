import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import AdminAnalytics from '../AdminAnalytics';
import { adminAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  adminAPI: {
    get: jest.fn()
  }
}));

describe('AdminAnalytics', () => {
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

  it('renders loading state initially', () => {
    render(<AdminAnalytics />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders analytics data when loaded', async () => {
    render(<AdminAnalytics />);

    await waitFor(() => {
      expect(screen.getByText('120')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('1500')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });

  it('changes time range when dropdown is changed', async () => {
    render(<AdminAnalytics />);

    await waitFor(() => {
      expect(screen.getByText('120')).toBeInTheDocument();
    });

    const timeRangeSelect = screen.getByDisplayValue('Last 7 Days');
    fireEvent.change(timeRangeSelect, { target: { value: '30d' } });

    expect(adminAPI.get).toHaveBeenCalledTimes(2);
  });

  it('refreshes data when refresh button is clicked', async () => {
    render(<AdminAnalytics />);

    await waitFor(() => {
      expect(screen.getByText('120')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    expect(adminAPI.get).toHaveBeenCalledTimes(2);
  });

  it('renders chart placeholders', async () => {
    render(<AdminAnalytics />);

    await waitFor(() => {
      expect(screen.getByText('Quiz Performance')).toBeInTheDocument();
      expect(screen.getByText('User Activity')).toBeInTheDocument();
      expect(screen.getByText('Category Distribution')).toBeInTheDocument();
      expect(screen.getByText('Difficulty Breakdown')).toBeInTheDocument();
    });
  });
});
