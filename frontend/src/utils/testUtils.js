// Testing utilities for React components
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { QuizProvider } from '../contexts/QuizContext';
import { ErrorProvider } from '../contexts/ErrorContext';
import { Toaster } from 'react-hot-toast';

// Mock data generators
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user',
  isActive: true,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
};

export const mockAdmin = {
  id: '2',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  isActive: true,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
};

export const mockQuiz = {
  id: '1',
  title: 'Test Quiz',
  description: 'A test quiz for testing purposes',
  category: 'General',
  difficulty: 'medium',
  timeLimit: 30,
  isActive: true,
  showCorrectAnswers: true,
  randomizeQuestions: false,
  randomizeAnswers: false,
  passingScore: 70,
  attempts: 0,
  questions: [
    {
      id: '1',
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
      explanation: '2 + 2 equals 4',
      points: 1,
      type: 'multiple_choice',
      tags: ['math', 'basic'],
      media: { type: null, url: '', alt: '', caption: '' },
      hints: [],
      feedback: { correct: '', incorrect: '', partial: '' },
      difficulty: 'easy',
      timeLimit: 0,
      required: true,
      order: 1,
      metadata: {
        learningObjective: '',
        topic: '',
        subtopic: '',
        keywords: [],
        difficulty: 'easy',
        estimatedTime: 0
      }
    }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const mockScore = {
  id: '1',
  userId: '1',
  quizId: '1',
  score: 85,
  totalPoints: 100,
  percentage: 85,
  timeSpent: 1200,
  completedAt: new Date().toISOString(),
  answers: [
    {
      questionId: '1',
      selectedAnswer: 1,
      isCorrect: true,
      timeSpent: 30
    }
  ]
};

// Mock API responses
export const mockApiResponses = {
  quizzes: {
    list: {
      data: [mockQuiz],
      pagination: {
        current: 1,
        pages: 1,
        total: 1
      }
    },
    get: {
      data: mockQuiz
    },
    create: {
      data: { ...mockQuiz, id: '2' }
    },
    update: {
      data: mockQuiz
    },
    delete: {
      message: 'Quiz deleted successfully'
    }
  },
  users: {
    list: {
      data: [mockUser, mockAdmin],
      pagination: {
        current: 1,
        pages: 1,
        total: 2
      }
    },
    get: {
      data: mockUser
    },
    update: {
      data: mockUser
    },
    delete: {
      message: 'User deleted successfully'
    }
  },
  scores: {
    list: {
      data: [mockScore],
      pagination: {
        current: 1,
        pages: 1,
        total: 1
      }
    }
  },
  auth: {
    login: {
      data: {
        user: mockUser,
        token: 'mock-jwt-token'
      }
    },
    register: {
      data: {
        user: mockUser,
        token: 'mock-jwt-token'
      }
    },
    profile: {
      data: mockUser
    }
  }
};

// Custom render function with providers
export const renderWithProviders = (
  ui,
  {
    initialAuthState = { user: null, token: null, loading: false },
    initialQuizState = { quizzes: [], loading: false },
    initialErrorState = { errors: [], isOnline: true, retryCount: 0 },
    ...renderOptions
  } = {}
) => {
  const AllTheProviders = ({ children }) => {
    return (
      <BrowserRouter>
        <ErrorProvider>
          <AuthProvider>
            <QuizProvider>
              {children}
              <Toaster />
            </QuizProvider>
          </AuthProvider>
        </ErrorProvider>
      </BrowserRouter>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

// Mock API functions
export const mockApi = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn()
};

// Mock localStorage
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

// Mock sessionStorage
export const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

// Mock window.location
export const mockLocation = {
  href: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn()
};

// Mock window.history
export const mockHistory = {
  pushState: jest.fn(),
  replaceState: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  go: jest.fn()
};

// Mock window.navigator
export const mockNavigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  onLine: true,
  language: 'en-US',
  languages: ['en-US', 'en'],
  platform: 'Win32',
  cookieEnabled: true
};

// Mock window.console
export const mockConsole = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

// Mock window.alert
export const mockAlert = jest.fn();

// Mock window.confirm
export const mockConfirm = jest.fn();

// Mock window.prompt
export const mockPrompt = jest.fn();

// Mock window.fetch
export const mockFetch = jest.fn();

// Mock window.gtag
export const mockGtag = jest.fn();

// Setup mocks
export const setupMocks = () => {
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });

  // Mock sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage,
    writable: true
  });

  // Mock location
  Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true
  });

  // Mock history
  Object.defineProperty(window, 'history', {
    value: mockHistory,
    writable: true
  });

  // Mock navigator
  Object.defineProperty(window, 'navigator', {
    value: mockNavigator,
    writable: true
  });

  // Mock console
  Object.defineProperty(window, 'console', {
    value: mockConsole,
    writable: true
  });

  // Mock alert
  Object.defineProperty(window, 'alert', {
    value: mockAlert,
    writable: true
  });

  // Mock confirm
  Object.defineProperty(window, 'confirm', {
    value: mockConfirm,
    writable: true
  });

  // Mock prompt
  Object.defineProperty(window, 'prompt', {
    value: mockPrompt,
    writable: true
  });

  // Mock fetch
  Object.defineProperty(window, 'fetch', {
    value: mockFetch,
    writable: true
  });

  // Mock gtag
  Object.defineProperty(window, 'gtag', {
    value: mockGtag,
    writable: true
  });
};

// Cleanup mocks
export const cleanupMocks = () => {
  jest.clearAllMocks();
  mockLocalStorage.getItem.mockClear();
  mockLocalStorage.setItem.mockClear();
  mockLocalStorage.removeItem.mockClear();
  mockLocalStorage.clear.mockClear();
  mockSessionStorage.getItem.mockClear();
  mockSessionStorage.setItem.mockClear();
  mockSessionStorage.removeItem.mockClear();
  mockSessionStorage.clear.mockClear();
  mockConsole.log.mockClear();
  mockConsole.error.mockClear();
  mockConsole.warn.mockClear();
  mockConsole.info.mockClear();
  mockConsole.debug.mockClear();
  mockAlert.mockClear();
  mockConfirm.mockClear();
  mockPrompt.mockClear();
  mockFetch.mockClear();
  mockGtag.mockClear();
};

// Test helpers
export const waitForLoadingToFinish = () => {
  return waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
};

export const waitForErrorToAppear = () => {
  return waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
};

export const waitForSuccessToAppear = () => {
  return waitFor(() => {
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
};

// Form testing helpers
export const fillFormField = (fieldName, value) => {
  const field = screen.getByLabelText(fieldName) || screen.getByPlaceholderText(fieldName);
  fireEvent.change(field, { target: { value } });
};

export const submitForm = () => {
  const submitButton = screen.getByRole('button', { name: /submit|save|create|update/i });
  fireEvent.click(submitButton);
};

export const clickButton = (buttonText) => {
  const button = screen.getByRole('button', { name: buttonText });
  fireEvent.click(button);
};

export const selectOption = (selectName, optionText) => {
  const select = screen.getByLabelText(selectName);
  fireEvent.change(select, { target: { value: optionText } });
};

export const checkCheckbox = (checkboxName) => {
  const checkbox = screen.getByLabelText(checkboxName);
  fireEvent.click(checkbox);
};

// Assertion helpers
export const expectElementToBeInDocument = (text) => {
  expect(screen.getByText(text)).toBeInTheDocument();
};

export const expectElementNotToBeInDocument = (text) => {
  expect(screen.queryByText(text)).not.toBeInTheDocument();
};

export const expectElementToHaveClass = (element, className) => {
  expect(element).toHaveClass(className);
};

export const expectElementToHaveAttribute = (element, attribute, value) => {
  expect(element).toHaveAttribute(attribute, value);
};

// Mock API responses
export const mockApiResponse = (data, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  });
};

export const mockApiError = (message = 'API Error', status = 500) => {
  return Promise.reject({
    response: {
      status,
      data: { message }
    },
    message
  });
};

// Test data factories
export const createMockUser = (overrides = {}) => ({
  ...mockUser,
  ...overrides
});

export const createMockQuiz = (overrides = {}) => ({
  ...mockQuiz,
  ...overrides
});

export const createMockScore = (overrides = {}) => ({
  ...mockScore,
  ...overrides
});

// Test constants
export const TEST_CONSTANTS = {
  TIMEOUT: 10000,
  RETRY_DELAY: 1000,
  MAX_RETRIES: 3,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DELAY: 100
};

export default {
  renderWithProviders,
  setupMocks,
  cleanupMocks,
  waitForLoadingToFinish,
  waitForErrorToAppear,
  waitForSuccessToAppear,
  fillFormField,
  submitForm,
  clickButton,
  selectOption,
  checkCheckbox,
  expectElementToBeInDocument,
  expectElementNotToBeInDocument,
  expectElementToHaveClass,
  expectElementToHaveAttribute,
  mockApiResponse,
  mockApiError,
  createMockUser,
  createMockQuiz,
  createMockScore,
  TEST_CONSTANTS
};
