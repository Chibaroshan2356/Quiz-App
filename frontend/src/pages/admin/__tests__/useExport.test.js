import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useExport } from '../useExport';
import { adminAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  adminAPI: {
    get: jest.fn()
  }
}));

// Test component that uses the export hook
const TestComponent = () => {
  const {
    exportData,
    loading,
    error,
    exportUsers,
    exportQuizzes,
    exportScores,
    exportAnalytics
  } = useExport();

  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'No error'}</div>
      <button onClick={() => exportUsers('csv')}>Export Users CSV</button>
      <button onClick={() => exportQuizzes('excel')}>Export Quizzes Excel</button>
      <button onClick={() => exportScores('csv')}>Export Scores CSV</button>
      <button onClick={() => exportAnalytics('pdf')}>Export Analytics PDF</button>
    </div>
  );
};

describe('useExport', () => {
  const mockExportData = {
    users: [{ id: 1, name: 'John Doe', email: 'john@example.com' }],
    quizzes: [{ id: 1, title: 'Science Quiz', category: 'Science' }],
    scores: [{ id: 1, userId: 1, quizId: 1, score: 85 }],
    analytics: { totalUsers: 100, totalQuizzes: 50 }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    adminAPI.get.mockResolvedValue({ data: mockExportData });
  });

  it('provides export state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('No error');
  });

  it('handles exportUsers action', async () => {
    render(<TestComponent />);
    
    const exportButton = screen.getByText('Export Users CSV');
    fireEvent.click(exportButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.get).toHaveBeenCalledWith('/export/users?format=csv');
    });
  });

  it('handles exportQuizzes action', async () => {
    render(<TestComponent />);
    
    const exportButton = screen.getByText('Export Quizzes Excel');
    fireEvent.click(exportButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.get).toHaveBeenCalledWith('/export/quizzes?format=excel');
    });
  });

  it('handles exportScores action', async () => {
    render(<TestComponent />);
    
    const exportButton = screen.getByText('Export Scores CSV');
    fireEvent.click(exportButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.get).toHaveBeenCalledWith('/export/scores?format=csv');
    });
  });

  it('handles exportAnalytics action', async () => {
    render(<TestComponent />);
    
    const exportButton = screen.getByText('Export Analytics PDF');
    fireEvent.click(exportButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.get).toHaveBeenCalledWith('/export/analytics?format=pdf');
    });
  });
});
