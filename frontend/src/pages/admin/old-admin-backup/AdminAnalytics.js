import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBarChart2,
  FiTrendingUp,
  FiTrendingDown,
  FiUsers,
  FiBookOpen,
  FiTarget,
  FiClock,
  FiDownload,
  FiRefreshCw,
  FiCalendar,
  FiFilter,
  FiEye,
  FiActivity,
  FiAward,
  FiZap,
  FiStar,
  FiChevronRight,
  FiChevronLeft,
  FiMaximize2,
  FiMinimize2,
  FiPieChart,
  FiLineChart,
  FiBarChart3,
  FiGrid,
  FiList
} from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [viewMode, setViewMode] = useState('overview'); // overview, quizzes, users, performance
  const [timeRange, setTimeRange] = useState('7d'); // 1d, 7d, 30d, 90d, 1y
  const [expandedCards, setExpandedCards] = useState({});
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Analytics data
  const [analytics, setAnalytics] = useState({
    overview: null,
    quizzes: [],
    users: [],
    performance: null,
    trends: null
  });

  // Fetch analytics data
  const fetchAnalytics = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await adminAPI.get('/analytics', {
        params: { timeRange }
      });

      setAnalytics(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchAnalytics(true);
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, timeRange]);

  // Initial load
  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  // Toggle card expansion
  const toggleCardExpansion = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Export analytics data
  const exportAnalytics = (type) => {
    try {
      let data, filename;
      
      switch (type) {
        case 'overview':
          data = analytics.overview;
          filename = 'analytics-overview.csv';
          break;
        case 'quizzes':
          data = analytics.quizzes;
          filename = 'quiz-analytics.csv';
          break;
        case 'users':
          data = analytics.users;
          filename = 'user-analytics.csv';
          break;
        case 'performance':
          data = analytics.performance;
          filename = 'performance-analytics.csv';
          break;
        default:
          return;
      }

      const csv = convertToCSV(data);
      downloadCSV(csv, filename);
      toast.success('Analytics data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export analytics data');
    }
  };

  // Convert data to CSV
  const convertToCSV = (data) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return 'No data available';
    }

    if (Array.isArray(data)) {
      const headers = Object.keys(data[0] || {});
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
      ].join('\n');
      return csvContent;
    } else {
      const headers = Object.keys(data);
      const csvContent = [
        headers.join(','),
        headers.map(header => `"${data[header] || ''}"`).join(',')
      ].join('\n');
      return csvContent;
    }
  };

  // Download CSV
  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Calculate percentage change
  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Format number with K/M suffix
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Time range options
  const timeRangeOptions = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  // View mode options
  const viewModeOptions = [
    { value: 'overview', label: 'Overview', icon: FiBarChart2 },
    { value: 'quizzes', label: 'Quiz Analytics', icon: FiBookOpen },
    { value: 'users', label: 'User Analytics', icon: FiUsers },
    { value: 'performance', label: 'Performance', icon: FiTarget }
  ];

  // Mock data for demonstration (replace with real API calls)
  const mockAnalytics = {
    overview: {
      totalQuizzes: 45,
      totalUsers: 1234,
      totalAttempts: 5678,
      averageScore: 78.5,
      completionRate: 85.2,
      activeUsers: 456,
      newUsers: 23,
      quizGrowth: 12.5,
      userGrowth: 8.3,
      attemptGrowth: 15.7,
      scoreGrowth: 2.1
    },
    quizzes: [
      { id: 1, title: 'JavaScript Fundamentals', attempts: 234, avgScore: 82.5, completionRate: 88.2, category: 'Technology' },
      { id: 2, title: 'React Basics', attempts: 189, avgScore: 76.3, completionRate: 91.5, category: 'Technology' },
      { id: 3, title: 'General Knowledge', attempts: 156, avgScore: 71.8, completionRate: 79.4, category: 'General' },
      { id: 4, title: 'Science Quiz', attempts: 134, avgScore: 85.2, completionRate: 87.3, category: 'Science' },
      { id: 5, title: 'History Test', attempts: 98, avgScore: 68.9, completionRate: 72.1, category: 'History' }
    ],
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com', totalScore: 2450, quizzesCompleted: 12, avgScore: 78.2, lastActive: '2024-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', totalScore: 1890, quizzesCompleted: 8, avgScore: 82.1, lastActive: '2024-01-14' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', totalScore: 1675, quizzesCompleted: 6, avgScore: 75.8, lastActive: '2024-01-13' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', totalScore: 2100, quizzesCompleted: 10, avgScore: 80.5, lastActive: '2024-01-12' },
      { id: 5, name: 'David Brown', email: 'david@example.com', totalScore: 1450, quizzesCompleted: 5, avgScore: 72.3, lastActive: '2024-01-11' }
    ],
    performance: {
      responseTime: 120,
      uptime: 99.9,
      errorRate: 0.1,
      throughput: 150,
      memoryUsage: 65.2,
      cpuUsage: 45.8,
      databaseConnections: 23,
      cacheHitRate: 94.5
    },
    trends: {
      dailyAttempts: [45, 52, 38, 67, 89, 76, 94, 87, 92, 78, 85, 91, 88, 95, 82, 89, 93, 87, 91, 88, 85, 92, 89, 94, 87, 91, 88, 95, 92, 89],
      dailyUsers: [12, 15, 8, 18, 22, 19, 25, 21, 24, 18, 20, 23, 21, 26, 19, 22, 24, 20, 23, 21, 19, 24, 22, 26, 20, 23, 21, 26, 24, 22],
      averageScores: [75, 78, 72, 81, 79, 76, 83, 80, 82, 77, 79, 84, 81, 85, 78, 82, 84, 79, 83, 81, 78, 84, 82, 86, 80, 83, 81, 86, 84, 82]
    }
  };

  // Use mock data if no real data
  const data = analytics.overview ? analytics : mockAnalytics;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiActivity className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Analytics</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => fetchAnalytics()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive insights into your quiz platform performance</p>
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Auto-refresh Toggle */}
              <div className="flex items-center gap-2">
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="mr-2"
                  />
                  Auto-refresh
                </label>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => fetchAnalytics(true)}
                disabled={refreshing}
                className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiRefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>

              {/* Export Button */}
              <button
                onClick={() => exportAnalytics(viewMode)}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {viewModeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setViewMode(option.value)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    viewMode === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {viewMode === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  id: 'totalQuizzes',
                  title: 'Total Quizzes',
                  value: data.overview?.totalQuizzes || 0,
                  change: data.overview?.quizGrowth || 0,
                  icon: FiBookOpen,
                  color: 'blue',
                  suffix: ''
                },
                {
                  id: 'totalUsers',
                  title: 'Total Users',
                  value: data.overview?.totalUsers || 0,
                  change: data.overview?.userGrowth || 0,
                  icon: FiUsers,
                  color: 'green',
                  suffix: ''
                },
                {
                  id: 'totalAttempts',
                  title: 'Total Attempts',
                  value: data.overview?.totalAttempts || 0,
                  change: data.overview?.attemptGrowth || 0,
                  icon: FiTarget,
                  color: 'purple',
                  suffix: ''
                },
                {
                  id: 'averageScore',
                  title: 'Average Score',
                  value: data.overview?.averageScore || 0,
                  change: data.overview?.scoreGrowth || 0,
                  icon: FiAward,
                  color: 'yellow',
                  suffix: '%'
                }
              ].map((metric) => {
                const Icon = metric.icon;
                const isExpanded = expandedCards[metric.id];
                const changeColor = metric.change >= 0 ? 'text-green-600' : 'text-red-600';
                const changeIcon = metric.change >= 0 ? FiTrendingUp : FiTrendingDown;
                const ChangeIcon = changeIcon;

                return (
                  <div
                    key={metric.id}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => toggleCardExpansion(metric.id)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${
                        metric.color === 'blue' ? 'from-blue-500 to-blue-600' :
                        metric.color === 'green' ? 'from-green-500 to-green-600' :
                        metric.color === 'purple' ? 'from-purple-500 to-purple-600' :
                        'from-yellow-500 to-yellow-600'
                      } rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center text-sm font-medium ${changeColor}`}>
                          <ChangeIcon className="w-4 h-4 mr-1" />
                          {Math.abs(metric.change).toFixed(1)}%
                        </div>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          {isExpanded ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {formatNumber(metric.value)}{metric.suffix}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{metric.title}</p>
                    
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Growth this period</span>
                          <span className={changeColor}>
                            {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(1)}%
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                metric.color === 'blue' ? 'bg-blue-500' :
                                metric.color === 'green' ? 'bg-green-500' :
                                metric.color === 'purple' ? 'bg-purple-500' :
                                'bg-yellow-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, metric.value / 10))}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Daily Attempts Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Daily Quiz Attempts</h2>
                  <div className="flex items-center gap-2">
                    <FiLineChart className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-500">Last 30 days</span>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between space-x-1">
                  {data.trends?.dailyAttempts?.map((value, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 rounded-t flex-1 mx-0.5"
                      style={{ height: `${(value / Math.max(...data.trends.dailyAttempts)) * 100}%` }}
                      title={`Day ${index + 1}: ${value} attempts`}
                    />
                  ))}
                </div>
              </div>

              {/* Average Scores Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Average Scores Trend</h2>
                  <div className="flex items-center gap-2">
                    <FiBarChart3 className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-500">Last 30 days</span>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between space-x-1">
                  {data.trends?.averageScores?.map((value, index) => (
                    <div
                      key={index}
                      className="bg-green-500 rounded-t flex-1 mx-0.5"
                      style={{ height: `${(value / 100) * 100}%` }}
                      title={`Day ${index + 1}: ${value}%`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Completion Rate</h3>
                  <FiTarget className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {data.overview?.completionRate || 0}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${data.overview?.completionRate || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
                  <FiUsers className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {data.overview?.activeUsers || 0}
                </div>
                <p className="text-sm text-gray-500">Currently online</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">New Users Today</h3>
                  <FiZap className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {data.overview?.newUsers || 0}
                </div>
                <p className="text-sm text-gray-500">Registered today</p>
              </div>
            </div>
          </>
        )}

        {/* Quiz Analytics Tab */}
        {viewMode === 'quizzes' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Quiz Performance</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportAnalytics('quizzes')}
                    className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
                    title="Export quiz data"
                  >
                    <FiDownload className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quiz
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attempts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completion Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.quizzes?.map((quiz) => (
                      <tr key={quiz.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <FiBookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {quiz.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {quiz.attempts}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              quiz.avgScore >= 80 ? 'bg-green-100 text-green-800' :
                              quiz.avgScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {quiz.avgScore}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              quiz.completionRate >= 80 ? 'bg-green-100 text-green-800' :
                              quiz.completionRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {quiz.completionRate}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedQuiz(quiz)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* User Analytics Tab */}
        {viewMode === 'users' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">User Performance</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportAnalytics('users')}
                    className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
                    title="Export user data"
                  >
                    <FiDownload className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quizzes Completed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Average Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.users?.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-semibold text-white">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.totalScore}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.quizzesCompleted}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.avgScore >= 80 ? 'bg-green-100 text-green-800' :
                              user.avgScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {user.avgScore}%
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.lastActive).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {viewMode === 'performance' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Response Time',
                  value: `${data.performance?.responseTime || 0}ms`,
                  icon: FiClock,
                  color: 'blue',
                  status: (data.performance?.responseTime || 0) < 200 ? 'good' : 'warning'
                },
                {
                  title: 'Uptime',
                  value: `${data.performance?.uptime || 0}%`,
                  icon: FiActivity,
                  color: 'green',
                  status: (data.performance?.uptime || 0) > 99 ? 'good' : 'warning'
                },
                {
                  title: 'Error Rate',
                  value: `${data.performance?.errorRate || 0}%`,
                  icon: FiTarget,
                  color: 'red',
                  status: (data.performance?.errorRate || 0) < 1 ? 'good' : 'warning'
                },
                {
                  title: 'Throughput',
                  value: `${data.performance?.throughput || 0}/min`,
                  icon: FiZap,
                  color: 'purple',
                  status: 'good'
                }
              ].map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${
                        metric.color === 'blue' ? 'from-blue-500 to-blue-600' :
                        metric.color === 'green' ? 'from-green-500 to-green-600' :
                        metric.color === 'red' ? 'from-red-500 to-red-600' :
                        'from-purple-500 to-purple-600'
                      } rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        metric.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                    <p className="text-gray-600 text-sm">{metric.title}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Resources</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Memory Usage</span>
                      <span>{data.performance?.memoryUsage || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${data.performance?.memoryUsage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>CPU Usage</span>
                      <span>{data.performance?.cpuUsage || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${data.performance?.cpuUsage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Connections</span>
                    <span className="text-sm font-medium text-gray-900">{data.performance?.databaseConnections || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cache Hit Rate</span>
                    <span className="text-sm font-medium text-gray-900">{data.performance?.cacheHitRate || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
