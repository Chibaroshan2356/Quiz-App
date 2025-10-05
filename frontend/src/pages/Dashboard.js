import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { scoreAPI, quizAPI } from '../services/api';
import { FiBookOpen, FiAward, FiClock, FiTrendingUp, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentScores, setRecentScores] = useState([]);
  const [recommendedQuizzes, setRecommendedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, scoresResponse, quizzesResponse] = await Promise.all([
          scoreAPI.getUserStats(),
          scoreAPI.getUserScores(user.id, { limit: 5 }),
          quizAPI.getQuizzes({ limit: 6 })
        ]);

        setStats(statsResponse.data.stats);
        setRecentScores(scoresResponse.data.scores);
        setRecommendedQuizzes(quizzesResponse.data.quizzes);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: 'badge-easy',
      medium: 'badge-medium',
      hard: 'badge-hard'
    };
    return badges[difficulty] || 'badge-medium';
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Helper to build a simple sparkline path from percentages
  const buildSpark = (arr = []) => {
    const pts = arr.slice(-12);
    if (pts.length === 0) return '';
    const w = 280; const h = 80; const pad = 6;
    const step = (w - pad * 2) / Math.max(1, pts.length - 1);
    const norm = (v) => h - pad - ((v || 0) / 100) * (h - pad * 2);
    return pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * step} ${norm(v)}`).join(' ');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Ready to test your knowledge? Let's see how you're doing.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="surface p-5 elevated">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiBookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Quizzes Taken</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalQuizzesTaken || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="surface p-5 elevated">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiAward className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.averageScore || 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="surface p-5 elevated">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((stats?.totalTimeSpent || 0) / 60)}m
                </p>
              </div>
            </div>
          </div>

          <div className="surface p-5 elevated">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.bestScore || 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Scores */}
          <div className="lg:col-span-2">
            <div className="surface p-6 elevated">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Scores</h2>
                <Link
                  to="/profile"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View all
                </Link>
              </div>

              {recentScores.length > 0 ? (
                <div className="space-y-4">
                  {recentScores.map((score) => (
                    <div
                      key={score._id}
                      className="flex items-center justify-between p-4 surface"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {score.quiz?.title}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className={`badge ${getDifficultyBadge(score.quiz?.difficulty)}`}>
                            {score.quiz?.difficulty}
                          </span>
                          <span className="text-sm text-gray-500">
                            {score.quiz?.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(score.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-semibold ${getPerformanceColor(score.percentage)}`}>
                          {score.percentage}%
                        </p>
                        <p className="text-sm text-gray-500">
                          {score.score}/{score.totalPoints} points
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiBarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No quiz scores yet</p>
                  <Link
                    to="/quizzes"
                    className="btn btn-gradient mt-4"
                  >
                    Take Your First Quiz
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Quizzes */}
          <div>
            <div className="surface p-6 elevated">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recommended</h2>
                <Link
                  to="/quizzes"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Browse all
                </Link>
              </div>

              <div className="space-y-4">
                {recommendedQuizzes.slice(0, 3).map((quiz) => (
                  <div key={quiz._id} className="p-4 surface">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`badge ${getDifficultyBadge(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <FiClock className="w-4 h-4 mr-1" />
                        {Math.ceil(quiz.timeLimit / 60)}m
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {quiz.description || 'Test your knowledge with this engaging quiz.'}
                    </p>
                    <Link
                      to={`/quiz/${quiz._id}`}
                      className="flex items-center btn-gradient rounded-full px-3 py-2 text-white font-medium text-sm"
                    >
                      Start Quiz
                      <FiArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Performance */}
            {stats?.categories && Object.keys(stats.categories).length > 0 && (
              <div className="surface p-6 elevated mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Category Performance
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.categories).map(([category, data]) => (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{category}</span>
                        <span className="text-gray-500">{data.averageScore}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${data.averageScore}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trend Sparkline */}
            {recentScores.length > 0 && (
              <div className="surface p-6 elevated mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Trend</h3>
                <svg width="100%" height="100" viewBox="0 0 300 100">
                  <defs>
                    <linearGradient id="spark" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1"/>
                      <stop offset="50%" stopColor="#3b82f6"/>
                      <stop offset="100%" stopColor="#06b6d4"/>
                    </linearGradient>
                  </defs>
                  <path d={buildSpark(recentScores.map(s => s.percentage))} fill="none" stroke="url(#spark)" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
