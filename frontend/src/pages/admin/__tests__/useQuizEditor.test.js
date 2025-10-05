import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useQuizEditor } from '../CreateQuiz';
import { quizAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  quizAPI: {
    post: jest.fn(),
    put: jest.fn()
  }
}));

// Test component that uses the quiz editor hook
const TestComponent = () => {
  const {
    quizData,
    setQuizData,
    addQuestion,
    removeQuestion,
    updateQuestion,
    saveQuiz,
    publishQuiz,
    validateQuiz
  } = useQuizEditor();

  return (
    <div>
      <div data-testid="quiz-title">{quizData.title}</div>
      <div data-testid="question-count">{quizData.questions.length}</div>
      <input
        data-testid="title-input"
        value={quizData.title}
        onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
        placeholder="Quiz Title"
      />
      <button onClick={addQuestion}>Add Question</button>
      <button onClick={() => removeQuestion(0)}>Remove Question</button>
      <button onClick={() => updateQuestion(0, { question: 'Updated question' })}>Update Question</button>
      <button onClick={saveQuiz}>Save Quiz</button>
      <button onClick={publishQuiz}>Publish Quiz</button>
      <button onClick={validateQuiz}>Validate Quiz</button>
    </div>
  );
};

describe('useQuizEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    quizAPI.post.mockResolvedValue({ data: { id: 1 } });
    quizAPI.put.mockResolvedValue({ data: { id: 1 } });
  });

  it('provides quiz editor state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('quiz-title')).toHaveTextContent('');
    expect(screen.getByTestId('question-count')).toHaveTextContent('1');
  });

  it('updates quiz data when input changes', () => {
    render(<TestComponent />);
    
    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'Test Quiz' } });
    
    expect(screen.getByTestId('quiz-title')).toHaveTextContent('Test Quiz');
  });

  it('adds question when addQuestion is called', () => {
    render(<TestComponent />);
    
    const addButton = screen.getByText('Add Question');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('question-count')).toHaveTextContent('2');
  });

  it('removes question when removeQuestion is called', () => {
    render(<TestComponent />);
    
    const removeButton = screen.getByText('Remove Question');
    fireEvent.click(removeButton);
    
    expect(screen.getByTestId('question-count')).toHaveTextContent('0');
  });

  it('updates question when updateQuestion is called', () => {
    render(<TestComponent />);
    
    const updateButton = screen.getByText('Update Question');
    fireEvent.click(updateButton);
    
    expect(screen.getByTestId('question-count')).toHaveTextContent('1');
  });

  it('saves quiz when saveQuiz is called', async () => {
    render(<TestComponent />);
    
    const saveButton = screen.getByText('Save Quiz');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(quizAPI.post).toHaveBeenCalled();
    });
  });

  it('publishes quiz when publishQuiz is called', async () => {
    render(<TestComponent />);
    
    const publishButton = screen.getByText('Publish Quiz');
    fireEvent.click(publishButton);
    
    await waitFor(() => {
      expect(quizAPI.post).toHaveBeenCalled();
    });
  });

  it('validates quiz when validateQuiz is called', () => {
    render(<TestComponent />);
    
    const validateButton = screen.getByText('Validate Quiz');
    fireEvent.click(validateButton);
    
    // Validation should run without errors
    expect(screen.getByTestId('question-count')).toHaveTextContent('1');
  });
});
