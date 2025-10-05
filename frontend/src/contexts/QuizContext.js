import React, { createContext, useContext, useReducer } from 'react';

const QuizContext = createContext();

const initialState = {
  currentQuiz: null,
  currentQuestion: 0,
  answers: [],
  timeRemaining: 0,
  isQuizActive: false,
  quizResults: null,
  loading: false,
  error: null
};

const quizReducer = (state, action) => {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...state,
        currentQuiz: action.payload.quiz,
        currentQuestion: 0,
        answers: [],
        timeRemaining: action.payload.quiz.timeLimit,
        isQuizActive: true,
        quizResults: null,
        error: null
      };
    case 'ANSWER_QUESTION':
      const newAnswers = [...state.answers];
      newAnswers[state.currentQuestion] = {
        questionId: action.payload.questionId,
        selectedAnswer: action.payload.selectedAnswer,
        timeSpent: action.payload.timeSpent
      };
      return {
        ...state,
        answers: newAnswers
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestion: state.currentQuestion + 1
      };
    case 'PREV_QUESTION':
      return {
        ...state,
        currentQuestion: Math.max(0, state.currentQuestion - 1)
      };
    case 'GO_TO_QUESTION':
      return {
        ...state,
        currentQuestion: action.payload
      };
    case 'UPDATE_TIMER':
      return {
        ...state,
        timeRemaining: action.payload
      };
    case 'SUBMIT_QUIZ':
      return {
        ...state,
        isQuizActive: false,
        quizResults: action.payload
      };
    case 'RESET_QUIZ':
      return {
        ...state,
        currentQuiz: null,
        currentQuestion: 0,
        answers: [],
        timeRemaining: 0,
        isQuizActive: false,
        quizResults: null,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const QuizProvider = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const startQuiz = (quiz) => {
    dispatch({
      type: 'START_QUIZ',
      payload: { quiz }
    });
  };

  const answerQuestion = (questionId, selectedAnswer, timeSpent) => {
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: { questionId, selectedAnswer, timeSpent }
    });
  };

  const nextQuestion = () => {
    dispatch({ type: 'NEXT_QUESTION' });
  };

  const prevQuestion = () => {
    dispatch({ type: 'PREV_QUESTION' });
  };

  const goToQuestion = (questionIndex) => {
    dispatch({ type: 'GO_TO_QUESTION', payload: questionIndex });
  };

  const updateTimer = (timeRemaining) => {
    dispatch({ type: 'UPDATE_TIMER', payload: timeRemaining });
  };

  const submitQuiz = (results) => {
    dispatch({ type: 'SUBMIT_QUIZ', payload: results });
  };

  const resetQuiz = () => {
    dispatch({ type: 'RESET_QUIZ' });
  };

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const getCurrentQuestion = () => {
    if (!state.currentQuiz || !state.isQuizActive) return null;
    return state.currentQuiz.questions[state.currentQuestion];
  };

  const getAnsweredQuestions = () => {
    return state.answers.filter(answer => answer !== undefined).length;
  };

  const getTotalQuestions = () => {
    return state.currentQuiz ? state.currentQuiz.questions.length : 0;
  };

  const isQuestionAnswered = (questionIndex) => {
    return state.answers[questionIndex] !== undefined;
  };

  const getQuestionAnswer = (questionIndex) => {
    return state.answers[questionIndex];
  };

  const isLastQuestion = () => {
    return state.currentQuestion === getTotalQuestions() - 1;
  };

  const isFirstQuestion = () => {
    return state.currentQuestion === 0;
  };

  const getProgress = () => {
    const total = getTotalQuestions();
    const answered = getAnsweredQuestions();
    return total > 0 ? (answered / total) * 100 : 0;
  };

  const value = {
    ...state,
    startQuiz,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    updateTimer,
    submitQuiz,
    resetQuiz,
    setLoading,
    setError,
    clearError,
    getCurrentQuestion,
    getAnsweredQuestions,
    getTotalQuestions,
    isQuestionAnswered,
    getQuestionAnswer,
    isLastQuestion,
    isFirstQuestion,
    getProgress
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
