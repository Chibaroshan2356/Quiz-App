// Jest setup file for testing configuration
import '@testing-library/jest-dom';
import { setupMocks, cleanupMocks } from './utils/testUtils';

// Setup mocks before each test
beforeEach(() => {
  setupMocks();
});

// Cleanup mocks after each test
afterEach(() => {
  cleanupMocks();
});

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
    promise: jest.fn()
  },
  Toaster: () => <div data-testid="toaster" />
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null
  }),
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()]
}));

// Mock API service
jest.mock('./services/api', () => ({
  authAPI: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  },
  quizAPI: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  },
  scoreAPI: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  },
  adminAPI: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

// Mock contexts
jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    token: null,
    loading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    updateProfile: jest.fn()
  }),
  AuthProvider: ({ children }) => children
}));

jest.mock('./contexts/QuizContext', () => ({
  useQuiz: () => ({
    quizzes: [],
    loading: false,
    fetchQuizzes: jest.fn(),
    createQuiz: jest.fn(),
    updateQuiz: jest.fn(),
    deleteQuiz: jest.fn()
  }),
  QuizProvider: ({ children }) => children
}));

jest.mock('./contexts/ErrorContext', () => ({
  useError: () => ({
    errors: [],
    isOnline: true,
    retryCount: 0,
    addError: jest.fn(),
    removeError: jest.fn(),
    clearErrors: jest.fn(),
    handleApiError: jest.fn(),
    retry: jest.fn()
  }),
  ErrorProvider: ({ children }) => children
}));

// Mock components
jest.mock('./components/common/LoadingSpinner', () => {
  return function LoadingSpinner({ size = 'md' }) {
    return <div data-testid="loading-spinner" data-size={size}>Loading...</div>;
  };
});

jest.mock('./components/common/ErrorBoundary', () => {
  return function ErrorBoundary({ children, fallback }) {
    return children;
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

// Mock getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  value: jest.fn(() => 'mock-url'),
  writable: true
});

// Mock URL.revokeObjectURL
Object.defineProperty(URL, 'revokeObjectURL', {
  value: jest.fn(),
  writable: true
});

// Mock FileReader
global.FileReader = class FileReader {
  constructor() {
    this.result = null;
    this.error = null;
    this.readyState = 0;
    this.onload = null;
    this.onerror = null;
    this.onloadend = null;
  }
  
  readAsDataURL() {
    setTimeout(() => {
      this.readyState = 2;
      this.result = 'data:image/png;base64,mock-data';
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    }, 0);
  }
  
  readAsText() {
    setTimeout(() => {
      this.readyState = 2;
      this.result = 'mock-text';
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    }, 0);
  }
};

// Mock canvas
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => ({ data: new Array(4) })),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
}));

// Mock Image
global.Image = class Image {
  constructor() {
    this.src = '';
    this.alt = '';
    this.onload = null;
    this.onerror = null;
  }
};

// Mock Audio
global.Audio = class Audio {
  constructor() {
    this.src = '';
    this.volume = 1;
    this.muted = false;
    this.paused = true;
    this.currentTime = 0;
    this.duration = 0;
    this.onload = null;
    this.onerror = null;
    this.onplay = null;
    this.onpause = null;
    this.onended = null;
  }
  
  play() {
    return Promise.resolve();
  }
  
  pause() {
    return Promise.resolve();
  }
  
  load() {
    return Promise.resolve();
  }
};

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0))
  })
);

// Mock AbortController
global.AbortController = class AbortController {
  constructor() {
    this.signal = {
      aborted: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    };
  }
  
  abort() {
    this.signal.aborted = true;
  }
};

// Mock performance
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
    clearMarks: jest.fn(),
    clearMeasures: jest.fn()
  },
  writable: true
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// Mock setTimeout and clearTimeout
jest.useFakeTimers();

// Mock console methods in tests
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

// Restore console after tests
afterAll(() => {
  global.console = originalConsole;
});

// Global test utilities
global.testUtils = {
  setupMocks,
  cleanupMocks
};
