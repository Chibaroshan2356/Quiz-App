import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'styled-components';
import WorkingAdmin from './pages/admin/WorkingAdmin';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { QuizProvider } from './contexts/QuizContext';
import { ErrorProvider } from './contexts/ErrorContext';

// Theme and Styles
import ErrorBoundary from './components/common/ErrorBoundary';
import GlobalStyles from './theme/GlobalStyles';
import { theme } from './theme';
import './utils/globalErrorHandler';

// Layout Components
import Navbar from './components/layout/NavbarSimple';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public Pages
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const QuizList = React.lazy(() => import('./pages/QuizList'));
const Leaderboard = React.lazy(() => import('./pages/Leaderboard'));
const Multiplayer = React.lazy(() => import('./pages/Multiplayer'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));

// Protected Pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const QuizPage = React.lazy(() => import('./pages/QuizPage'));
const QuizBattle = React.lazy(() => import('./pages/QuizBattle'));
const Results = React.lazy(() => import('./pages/Results'));
const Profile = React.lazy(() => import('./pages/Profile'));
const QuizMasterDashboard = React.lazy(() => import('./pages/QuizMasterDashboard'));

// Admin Pages

// Loading Component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Component to conditionally render Footer
const ConditionalFooter = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    return null; // Don't render footer for admin routes
  }
  
  return <Footer />;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <ErrorProvider>
          <AuthProvider>
            <QuizProvider>
              <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <div className="min-h-screen bg-background flex flex-col">
                  <Navbar />
                  <main className="flex-1 py-6">
                    <React.Suspense fallback={<Loading />}>
                      <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/quizzes" element={<QuizList />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="/multiplayer" element={<Multiplayer />} />
                        
                        {/* Protected Routes */}
                        <Route path="/dashboard" element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        } />
                        <Route path="/quiz/:id" element={
                          <ProtectedRoute>
                            <QuizPage />
                          </ProtectedRoute>
                        } />
                        <Route path="/quiz/:id/battle" element={
                          <ProtectedRoute>
                            <QuizBattle />
                          </ProtectedRoute>
                        } />

                        <Route path="/results/:scoreId" element={
                          <ProtectedRoute>
                            <Results />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } />
                        
                        {/* QuizMaster Dashboard */}
                        <Route path="/quizmaster" element={
                          <ProtectedRoute>
                            <QuizMasterDashboard />
                          </ProtectedRoute>
                        } />
                    
                        {/* Admin Routes */}
                        <Route path="/admin" element={<WorkingAdmin />} />
                      </Routes>
                    </React.Suspense>
                  </main>
                  <ConditionalFooter />
                  <Toaster 
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        padding: '14px 16px',
                        borderRadius: '10px',
                        fontWeight: 600,
                        border: `1px solid ${theme.colors.secondary[300]}`,
                        background: 'linear-gradient(135deg, #ffffff, #f1f5f9)',
                        color: '#0f172a',
                      },
                      success: {
                        iconTheme: { primary: '#16a34a', secondary: '#ecfdf5' },
                        style: {
                          background: '#ecfdf5',
                          color: '#065f46',
                          borderLeft: '4px solid #16a34a',
                        },
                      },
                      error: {
                        duration: 5000,
                        iconTheme: { primary: '#dc2626', secondary: '#fef2f2' },
                        style: {
                          background: '#fef2f2',
                          color: '#7f1d1d',
                          borderLeft: '4px solid #dc2626',
                        },
                      },
                      loading: {
                        style: {
                          background: '#eff6ff',
                          color: '#1e3a8a',
                          borderLeft: '4px solid #3b82f6',
                        },
                      },
                    }}
                  />
                </div>
              </Router>
            </QuizProvider>
          </AuthProvider>
        </ErrorProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
