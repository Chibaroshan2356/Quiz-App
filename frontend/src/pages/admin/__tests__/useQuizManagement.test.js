import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useQuizManagement } from '../QuizManagement';
import { adminAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  adminAPI: {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

// Test component that uses the quiz management hook
const TestComponent = () => {
  const {
    quizzes,
    loading,
    error,
    fetchQuizzes,
    updateQuiz,
    deleteQuiz,
    bulkDeleteQuizzes,
    bulkUpdateQuizzes
  } = useQuizManagement();

  return (
    <div>
      <div data-testid="quiz-count">{quizzes.length}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'No error'}</div>
      <button onClick={fetchQuizzes}>Fetch Quizzes</button>
      <button onClick={() => updateQuiz(1, { isActive: false })}>Update Quiz</button>
      <button onClick={() => deleteQuiz(1)}>Delete Quiz</button>
      <button onClick={() => bulkDeleteQuizzes([1, 2])}>Bulk Delete</button>
      <button onClick={() => bulkUpdateQuizzes([1, 2], { isActive: false })}>Bulk Update</button>
    </div>
  );
};

describe('useQuizManagement', () => {
  const mockQuizzes = [
    { id: 1, title: 'Science Quiz', category: 'Science', difficulty: 'medium', isActive: true },
    { id: 2, title: 'Math Quiz', category: 'Math', difficulty: 'hard', isActive: false }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    adminAPI.get.mockResolvedValue({ data: mockQuizzes });
  });

  it('provides quiz management state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('quiz-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('No error');
  });

  it('handles fetchQuizzes action', async () => {
    render(<TestComponent />);
    
    const fetchButton = screen.getByText('Fetch Quizzes');
    fireEvent.click(fetchButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(screen.getByTestId('quiz-count')).toHaveTextContent('2');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  it('handles updateQuiz action', async () => {
    adminAPI.put.mockResolvedValue({ data: {} });
    
    render(<TestComponent />);
    
    const updateButton = screen.getByText('Update Quiz');
    fireEvent.click(updateButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.put).toHaveBeenCalledWith('/quizzes/1', { isActive: false });
    });
  });

  it('handles deleteQuiz action', async () => {
    adminAPI.delete.mockResolvedValue({ data: {} });
    
    render(<TestComponent />);
    
    const deleteButton = screen.getByText('Delete Quiz');
    fireEvent.click(deleteButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.delete).toHaveBeenCalledWith('/quizzes/1');
    });
  });

  it('handles bulkDeleteQuizzes action', async () => {
    adminAPI.delete.mockResolvedValue({ data: {} });
    
    render(<TestComponent />);
    
    const bulkDeleteButton = screen.getByText('Bulk Delete');
    fireEvent.click(bulkDeleteButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.delete).toHaveBeenCalledWith('/quizzes/bulk', { quizIds: [1, 2] });
    });
  });

  it('handles bulkUpdateQuizzes action', async () => {
    adminAPI.put.mockResolvedValue({ data: {} });
    
    render(<TestComponent />);
    
    const bulkUpdateButton = screen.getByText('Bulk Update');
    fireEvent.click(bulkUpdateButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.put).toHaveBeenCalledWith('/quizzes/bulk', { 
        quizIds: [1, 2], 
        updates: { isActive: false } 
      });
    });
  });
});
