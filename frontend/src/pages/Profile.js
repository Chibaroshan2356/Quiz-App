import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { scoreAPI } from '../services/api';
import { FiUser, FiMail, FiCalendar, FiAward, FiBookOpen, FiClock, FiTrendingUp, FiEdit3 } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentScores, setRecentScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [statsResponse, scoresResponse] = await Promise.all([
        scoreAPI.getUserStats(),
        scoreAPI.getUserScores(user.id, { limit: 10 })
      ]);

      setStats(statsResponse.data.stats);
      setRecentScores(scoresResponse.data.scores);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditData({
      name: user?.name || '',
      email: user?.email || ''
    });
  };

  const handleSave = () => {
    // In a real app, you'd have an API endpoint to update user profile
    updateUser(editData);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData({
      name: user?.name || '',
      email: user?.email || ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: 'badge-easy',
      medium: 'badge-medium',
      hard: 'badge-hard'
    };
    return badges[difficulty] || 'badge-medium';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="card mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <FiUser className="w-8 h-8 text-primary-600" />
                )}
              </div>
              <div>
                {editing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="input text-xl font-semibold"
                    />
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="input"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="btn btn-outline flex items-center"
                >
                  <FiEdit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
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

          <div className="card">
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

          <div className="card">
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

          <div className="card">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Scores */}
          <div>
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Scores</h2>
              
              {recentScores.length > 0 ? (
                <div className="space-y-4">
                  {recentScores.map((score) => (
                    <div
                      key={score._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
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
                            {formatDate(score.completedAt)}
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
                  <FiBookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No quiz scores yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Category Performance */}
          <div>
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Performance</h2>
              
              {stats?.categories && Object.keys(stats.categories).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(stats.categories).map(([category, data]) => (
                    <div key={category}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">{category}</span>
                        <span className="text-gray-500">
                          {data.averageScore}% ({data.count} quizzes)
                        </span>
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
              ) : (
                <div className="text-center py-8">
                  <FiTrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No category data available</p>
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <FiMail className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-900">{user?.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FiCalendar className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Member since:</span>
                  <span className="ml-2 text-gray-900">
                    {user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <FiAward className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Role:</span>
                  <span className="ml-2 text-gray-900 capitalize">{user?.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
