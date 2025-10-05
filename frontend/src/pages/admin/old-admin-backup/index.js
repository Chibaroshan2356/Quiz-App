import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import AdminUsers from './Users';
import AdminQuizzes from './Quizzes';
import AdminAnalytics from './AdminAnalytics';
import CreateQuiz from './CreateQuiz';
import EditQuiz from './EditQuiz';
import QuizDetails from './QuizDetails';
import UserDetails from './UserDetails';
import ActivityLog from './ActivityLog';
import Settings from './Settings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/users" element={<AdminUsers />} />
      <Route path="/users/:id" element={<UserDetails />} />
      <Route path="/quizzes" element={<AdminQuizzes />} />
      <Route path="/quizzes/new" element={<CreateQuiz />} />
      <Route path="/quizzes/:id" element={<QuizDetails />} />
      <Route path="/quizzes/:id/edit" element={<EditQuiz />} />
      <Route path="/analytics" element={<AdminAnalytics />} />
      <Route path="/activity" element={<ActivityLog />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
