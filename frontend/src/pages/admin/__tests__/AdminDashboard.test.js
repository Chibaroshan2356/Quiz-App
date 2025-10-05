import React from 'react';
import { render, screen, waitFor, fireEvent } from '../../../utils/testUtils';
import AdminDashboard from '../AdminDashboard';
import { adminAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  adminAPI: {
    get: jest.fn()
  }
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<AdminDashboard />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders dashboard with stats when data loads', async () => {
    const mockData = {
      totalQuizzes: 10,
      totalUsers: 50,
      totalAttempts: 100,
      averageScore: 75
    };

    adminAPI.get.mockResolvedValue({ data: mockData });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });

  it('handles refresh button click', async () => {
    const mockData = { totalQuizzes: 5 };
    adminAPI.get.mockResolvedValue({ data: mockData });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    expect(adminAPI.get).toHaveBeenCalledTimes(2);
  });

  it('handles export functionality', async () => {
    const mockData = { totalQuizzes: 5 };
    adminAPI.get.mockResolvedValue({ data: mockData });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Export Data')).toBeInTheDocument();
    });

    const exportButton = screen.getByText('Export Data');
    fireEvent.click(exportButton);

    expect(screen.getByText('Export Activity')).toBeInTheDocument();
    expect(screen.getByText('Export Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Export Users')).toBeInTheDocument();
  });
});
