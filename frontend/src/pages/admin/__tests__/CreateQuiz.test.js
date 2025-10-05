import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import CreateQuiz from '../CreateQuiz';
import { quizAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  quizAPI: {
    post: jest.fn(),
    put: jest.fn()
  }
}));

describe('CreateQuiz', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders quiz creation form', () => {
    render(<CreateQuiz />);
    
    expect(screen.getByLabelText('Quiz Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Difficulty')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<CreateQuiz />);
    
    const saveButton = screen.getByText('Save as Draft');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Quiz title is required')).toBeInTheDocument();
    });
  });

  it('adds new question when add question button is clicked', () => {
    render(<CreateQuiz />);
    
    const addQuestionButton = screen.getByText('Add Question');
    fireEvent.click(addQuestionButton);

    expect(screen.getAllByText('Question 1')).toHaveLength(2);
  });

  it('changes question type when dropdown is changed', () => {
    render(<CreateQuiz />);
    
    const questionTypeSelect = screen.getByDisplayValue('Multiple Choice');
    fireEvent.change(questionTypeSelect, { target: { value: 'true_false' } });

    expect(screen.getByText('True/False')).toBeInTheDocument();
  });

  it('saves quiz as draft', async () => {
    quizAPI.post.mockResolvedValue({ data: { id: 1 } });

    render(<CreateQuiz />);
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText('Quiz Title'), { 
      target: { value: 'Test Quiz' } 
    });
    fireEvent.change(screen.getByLabelText('Category'), { 
      target: { value: 'Science' } 
    });

    const saveButton = screen.getByText('Save as Draft');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(quizAPI.post).toHaveBeenCalledWith('/quizzes', expect.objectContaining({
        title: 'Test Quiz',
        category: 'Science',
        isActive: false
      }));
    });
  });
});
