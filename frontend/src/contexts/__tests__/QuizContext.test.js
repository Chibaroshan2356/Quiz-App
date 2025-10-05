import React from 'react';
import { render, screen, fireEvent } from '../../utils/testUtils';
import { QuizProvider, useQuiz } from '../QuizContext';

// Test component that uses the quiz context
const TestComponent = () => {
  const { quizzes, loading, fetchQuizzes, createQuiz, updateQuiz, deleteQuiz } = useQuiz();

  return (
    <div>
      <div data-testid="quiz-count">{quizzes.length}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <button onClick={() => fetchQuizzes()}>Fetch Quizzes</button>
      <button onClick={() => createQuiz({ title: 'Test Quiz' })}>Create Quiz</button>
      <button onClick={() => updateQuiz(1, { title: 'Updated Quiz' })}>Update Quiz</button>
      <button onClick={() => deleteQuiz(1)}>Delete Quiz</button>
    </div>
  );
};

describe('QuizContext', () => {
  it('provides quiz context to children', () => {
    render(
      <QuizProvider>
        <TestComponent />
      </QuizProvider>
    );
    
    expect(screen.getByTestId('quiz-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('handles fetchQuizzes action', () => {
    render(
      <QuizProvider>
        <TestComponent />
      </QuizProvider>
    );
    
    const fetchButton = screen.getByText('Fetch Quizzes');
    fireEvent.click(fetchButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('handles createQuiz action', () => {
    render(
      <QuizProvider>
        <TestComponent />
      </QuizProvider>
    );
    
    const createButton = screen.getByText('Create Quiz');
    fireEvent.click(createButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('handles updateQuiz action', () => {
    render(
      <QuizProvider>
        <TestComponent />
      </QuizProvider>
    );
    
    const updateButton = screen.getByText('Update Quiz');
    fireEvent.click(updateButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('handles deleteQuiz action', () => {
    render(
      <QuizProvider>
        <TestComponent />
      </QuizProvider>
    );
    
    const deleteButton = screen.getByText('Delete Quiz');
    fireEvent.click(deleteButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });
});
