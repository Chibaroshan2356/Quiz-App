import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import QuizManagement from './QuizManagement';
import UserManagement from './UserManagement';
import Analytics from './Analytics';
import Settings from './Settings';
import CreateQuiz from './CreateQuiz';
import EditQuiz from './EditQuiz';
import QuizDetails from './QuizDetails';
import UserDetails from './UserDetails';
import QuizAdmin from './QuizAdmin';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/quizzes" element={<QuizManagement />} />
      <Route path="/quizzes/new" element={<QuizAdmin />} />
      <Route path="/quizzes/new/:type" element={<CreateQuiz />} />
      <Route path="/quizzes/:id" element={<QuizDetails />} />
      <Route path="/quizzes/:id/edit" element={<EditQuiz />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/users/:id" element={<UserDetails />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/quiz-admin" element={<QuizAdmin />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
