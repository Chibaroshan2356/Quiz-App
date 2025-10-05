import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useImport } from '../useImport';
import { adminAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  adminAPI: {
    post: jest.fn()
  }
}));

// Test component that uses the import hook
const TestComponent = () => {
  const {
    importData,
    loading,
    error,
    importUsers,
    importQuizzes,
    importScores
  } = useImport();

  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'No error'}</div>
      <button onClick={() => importUsers(new File(['test'], 'users.csv', { type: 'text/csv' }))}>Import Users</button>
      <button onClick={() => importQuizzes(new File(['test'], 'quizzes.csv', { type: 'text/csv' }))}>Import Quizzes</button>
      <button onClick={() => importScores(new File(['test'], 'scores.csv', { type: 'text/csv' }))}>Import Scores</button>
    </div>
  );
};

describe('useImport', () => {
  const mockImportResult = {
    success: true,
    imported: 10,
    errors: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
    adminAPI.post.mockResolvedValue({ data: mockImportResult });
  });

  it('provides import state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('No error');
  });

  it('handles importUsers action', async () => {
    render(<TestComponent />);
    
    const importButton = screen.getByText('Import Users');
    fireEvent.click(importButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.post).toHaveBeenCalledWith('/import/users', expect.any(FormData));
    });
  });

  it('handles importQuizzes action', async () => {
    render(<TestComponent />);
    
    const importButton = screen.getByText('Import Quizzes');
    fireEvent.click(importButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.post).toHaveBeenCalledWith('/import/quizzes', expect.any(FormData));
    });
  });

  it('handles importScores action', async () => {
    render(<TestComponent />);
    
    const importButton = screen.getByText('Import Scores');
    fireEvent.click(importButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.post).toHaveBeenCalledWith('/import/scores', expect.any(FormData));
    });
  });
});
