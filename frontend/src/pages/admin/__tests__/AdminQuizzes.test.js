import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import QuizManagement from '../QuizManagement';
import { adminAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  adminAPI: {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

describe('QuizManagement', () => {
  const mockQuizzes = [
    {
      id: 1,
      title: 'Science Quiz',
      category: 'Science',
      difficulty: 'medium',
      isActive: true,
      attempts: 10,
      averageScore: 75
    },
    {
      id: 2,
      title: 'Math Quiz',
      category: 'Mathematics',
      difficulty: 'hard',
      isActive: false,
      attempts: 5,
      averageScore: 60
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    adminAPI.get.mockResolvedValue({ data: mockQuizzes });
  });

  it('renders quizzes table with data', async () => {
    render(<QuizManagement />);

    await waitFor(() => {
      expect(screen.getByText('Science Quiz')).toBeInTheDocument();
      expect(screen.getByText('Math Quiz')).toBeInTheDocument();
    });
  });

  it('filters quizzes by category', async () => {
    render(<QuizManagement />);

    await waitFor(() => {
      expect(screen.getByText('Science Quiz')).toBeInTheDocument();
    });

    const categoryFilter = screen.getByDisplayValue('All Categories');
    fireEvent.change(categoryFilter, { target: { value: 'Science' } });

    await waitFor(() => {
      expect(screen.getByText('Science Quiz')).toBeInTheDocument();
      expect(screen.queryByText('Math Quiz')).not.toBeInTheDocument();
    });
  });

  it('handles quiz activation/deactivation', async () => {
    adminAPI.put.mockResolvedValue({ data: {} });

    render(<QuizManagement />);

    await waitFor(() => {
      expect(screen.getByText('Science Quiz')).toBeInTheDocument();
    });

    const toggleButton = screen.getByText('Deactivate');
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(adminAPI.put).toHaveBeenCalledWith('/quizzes/1', expect.objectContaining({
        isActive: false
      }));
    });
  });

  it('handles bulk operations', async () => {
    render(<QuizManagement />);

    await waitFor(() => {
      expect(screen.getByText('Science Quiz')).toBeInTheDocument();
    });

    // Select quizzes
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Select first quiz

    // Click bulk action button
    const bulkActionButton = screen.getByText('Bulk Actions');
    fireEvent.click(bulkActionButton);

    expect(screen.getByText('Delete Selected')).toBeInTheDocument();
    expect(screen.getByText('Activate Selected')).toBeInTheDocument();
  });
});
