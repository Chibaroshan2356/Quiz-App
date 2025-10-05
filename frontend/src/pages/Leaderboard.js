import React, { useState, useEffect } from 'react';
import { scoreAPI } from '../services/api';
import { FiAward, FiClock, FiStar, FiFilter, FiRefreshCw } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    timeframe: 'all',
    limit: 20
  });

  useEffect(() => {
    fetchLeaderboard();
  }, [filters]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await scoreAPI.getLeaderboard(filters);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <FiAward className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <FiAward className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <FiAward className="w-6 h-6 text-orange-500" />;
    return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</span>;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-200';
    if (rank === 2) return 'bg-gray-50 border-gray-200';
    if (rank === 3) return 'bg-orange-50 border-orange-200';
    return 'bg-white border-gray-200';
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: 'badge-easy',
      medium: 'badge-medium',
      hard: 'badge-hard'
    };
    return badges[difficulty] || 'badge-medium';
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
            <FiAward className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 display">
            Leaderboard
          </h1>
          <p className="text-gray-600">
            See how you stack up against other quiz takers
          </p>
        </div>

        {/* Filters */}
        <div className="surface p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiFilter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
              </div>
              
              <select
                value={filters.timeframe}
                onChange={(e) => handleFilterChange('timeframe', e.target.value)}
                className="input"
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>

              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                className="input"
              >
                <option value={10}>Top 10</option>
                <option value={20}>Top 20</option>
                <option value={50}>Top 50</option>
                <option value={100}>Top 100</option>
              </select>
            </div>

            <button
              onClick={fetchLeaderboard}
              className="btn btn-gradient flex items-center"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <div
                key={entry._id}
                className={`surface p-5 elevated ${getRankColor(index + 1)} border-2`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(index + 1)}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        {entry.user?.avatar ? (
                          <img
                            src={entry.user.avatar}
                            alt={entry.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                        <span className="text-primary-600 font-semibold">
                            {entry.user?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {entry.user?.name || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {entry.quiz?.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <span className={`text-2xl font-bold ${
                          index < 3 ? 'text-yellow-600' : 'text-gray-900'
                        }`}>
                          {entry.percentage}%
                        </span>
                        <FiStar className="w-5 h-5 text-yellow-500" />
                      </div>
                      <p className="text-sm text-gray-500">Score</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center space-x-1">
                        <FiClock className="w-4 h-4 text-gray-500" />
                        <span className="text-lg font-semibold text-gray-900">
                          {formatTime(entry.timeTaken)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Time</p>
                    </div>

                    <div className="text-center">
                      <span className={`badge ${getDifficultyBadge(entry.quiz?.difficulty)}`}>
                        {entry.quiz?.difficulty}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">Difficulty</p>
                    </div>

                    <div className="text-center">
                      <span className="text-sm text-gray-500">
                        {new Date(entry.completedAt).toLocaleDateString()}
                      </span>
                      <p className="text-sm text-gray-500">Date</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiAward className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No scores found
            </h3>
            <p className="text-gray-500">
              Be the first to take a quiz and appear on the leaderboard!
            </p>
          </div>
        )}

        {/* Stats Summary */}
        {leaderboard.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {leaderboard.length}
              </h3>
              <p className="text-gray-600">Total Entries</p>
            </div>
            
            <div className="card text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {leaderboard.length > 0 ? Math.round(
                  leaderboard.reduce((sum, entry) => sum + entry.percentage, 0) / leaderboard.length
                ) : 0}%
              </h3>
              <p className="text-gray-600">Average Score</p>
            </div>
            
            <div className="card text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {leaderboard.length > 0 ? Math.round(
                  leaderboard.reduce((sum, entry) => sum + entry.timeTaken, 0) / leaderboard.length / 60
                ) : 0}m
              </h3>
              <p className="text-gray-600">Average Time</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
