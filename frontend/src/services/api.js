import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// Debug: log the API base used at build/runtime
try {
  // eslint-disable-next-line no-console
  console.info('[frontend] API_BASE_URL =', API_BASE_URL);
} catch (e) {}

// Simple in-memory GET cache and in-flight request deduper
const getCache = new Map(); // key -> { expiry: number, data: any }
const inflight = new Map(); // key -> Promise
const DEFAULT_TTL_MS = 60_000; // 60s cache for public GETs
const CATEGORY_TTL_MS = 5 * 60_000; // 5 minutes for categories

const makeKey = (url, params) => {
  try {
    return `${url}?${new URLSearchParams(params || {}).toString()}`;
  } catch {
    return url;
  }
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // GET caching and in-flight deduping
    if ((config.method || 'get').toLowerCase() === 'get') {
      const key = makeKey(config.url, config.params);
      // Serve from cache if fresh
      const cached = getCache.get(key);
      if (cached && cached.expiry > Date.now()) {
        // Emulate axios response via a resolved promise downstream
        // Attach a marker so response interceptor skips re-caching
        // We throw to short-circuit the request pipeline with a special object
        // but better: attach adapter override
        config.adapter = async () => ({
          data: cached.data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {}
        });
        return config;
      }

      // Coalesce identical in-flight requests
      if (!config.adapter) {
        const existing = inflight.get(key);
        if (existing) {
          config.adapter = () => existing;
          return config;
        }
        // Wrap the default adapter to register as inflight
        const adapter = axios.defaults.adapter;
        if (adapter) {
          const p = adapter(config).finally(() => inflight.delete(key));
          inflight.set(key, p);
          config.adapter = () => p;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors with refresh flow
let isRefreshing = false;
let pendingRequests = [];

const processQueue = (error, token = null) => {
  pendingRequests.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  pendingRequests = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const res = await api.post('/auth/refresh', {}, { withCredentials: true });
        const newToken = res.data?.token;
        if (newToken) {
          localStorage.setItem('token', newToken);
          api.defaults.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle rate limiting with exponential backoff
    if (status === 429 && (originalRequest.method || 'get').toLowerCase() === 'get') {
      originalRequest._retry429Count = originalRequest._retry429Count || 0;
      const retryCount = originalRequest._retry429Count;
      if (retryCount >= 3) {
        return Promise.reject(error);
      }
      originalRequest._retry429Count = retryCount + 1;
      const retryAfterHeader = error.response.headers?.['retry-after'];
      const retryAfterMs = retryAfterHeader
        ? Number.isNaN(Number(retryAfterHeader))
          ? 1000
          : Number(retryAfterHeader) * 1000
        : 1000 * Math.pow(2, retryCount); // 1s, 2s, 4s
      await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
      return api(originalRequest);
    }

    if (status === 403) {
      // Insufficient permissions; do not logout
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Response caching for GETs
api.interceptors.response.use((response) => {
  try {
    const method = (response.config.method || 'get').toLowerCase();
    if (method === 'get') {
      const key = makeKey(response.config.url, response.config.params);
      const isCategories = (response.config.url || '').includes('/quizzes/categories');
      const ttl = isCategories ? CATEGORY_TTL_MS : DEFAULT_TTL_MS;
      // Cache only successful responses briefly
      getCache.set(key, { expiry: Date.now() + ttl, data: response.data });
    }
  } catch {}
  return response;
});

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, avatar = '') => api.post('/auth/register', { name, email, password, avatar }),
  googleLogin: (googleData) => api.post('/auth/google', googleData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// Quiz API
export const quizAPI = {
  getQuizzes: (params = {}) => api.get('/quizzes', { params }),
  getQuiz: (id) => api.get(`/quizzes/${id}`),
  getRandomQuiz: (category) => api.get(`/quizzes/random/${category || ''}`),
  getCategories: () => api.get('/quizzes/categories/list'),
  createQuiz: (quizData) => api.post('/quizzes', quizData),
  updateQuiz: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
  deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
};

// Score API
export const scoreAPI = {
  submitScore: (scoreData) => api.post('/scores', scoreData),
  getLeaderboard: (params = {}) => api.get('/scores/leaderboard', { params }),
  getUserScores: (userId, params = {}) => api.get(`/scores/user/${userId}`, { params }),
  getQuizScores: (quizId, params = {}) => api.get(`/scores/quiz/${quizId}`, { params }),
  getUserStats: () => api.get('/scores/stats'),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAdminQuizzes: (params = {}) => api.get('/admin/quizzes', { params }),
  getAdminQuiz: (id) => api.get(`/admin/quizzes/${id}`),
  createQuiz: (quizData) => api.post('/admin/quizzes', quizData),
  updateQuiz: (id, quizData) => api.put(`/admin/quizzes/${id}`, quizData),
  deleteQuiz: (id) => api.delete(`/admin/quizzes/${id}`),
  getAdminScores: (params = {}) => api.get('/admin/scores', { params }),
  deleteScore: (id) => api.delete(`/admin/scores/${id}`),
  generateAIQuiz: ({ topic, difficulty, numQuestions }) => api.post('/admin/quizzes/ai-generate', { topic, difficulty, numQuestions })
};

// Public AI API (fallback)
export const aiAPI = {
  generate: ({ topic, difficulty, numQuestions }) => api.post('/ai/generate', { topic, difficulty, numQuestions })
};

export default api;
export { API_BASE_URL };
// Socket client (lazy-imported to not break SSR)
export async function getSocket() {
  const { io } = await import('socket.io-client');
  const url = process.env.REACT_APP_API_WS || (API_BASE_URL.replace('/api',''));
  const socket = io(url, {
    withCredentials: true,
    // Start with polling to avoid environments that block initial websocket handshakes
    transports: ['polling', 'websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  return socket;
}
