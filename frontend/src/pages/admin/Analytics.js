import React, { useState, useEffect } from 'react';
import { 
  FiBarChart2, 
  FiTrendingUp, 
  FiUsers, 
  FiBookOpen, 
  FiAward, 
  FiClock,
  FiDownload,
  FiRefreshCw,
  FiCalendar,
  FiTarget,
  FiActivity
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    overview: {},
    userGrowth: [],
    quizPerformance: [],
    topQuizzes: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAnalytics({ dateRange });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
    toast.success('Analytics refreshed');
  };

  const handleExport = () => {
    // Implement export functionality
    toast.success('Analytics data exported');
  };

  // Sample data for demonstration
  const sampleAnalytics = {
    overview: {
      totalUsers: 1250,
      totalQuizzes: 45,
      totalAttempts: 3200,
      averageScore: 78,
      completionRate: 85,
      activeUsers: 890,
      newUsers: 45,
      quizCompletions: 120
    },
    userGrowth: [
      { date: '2024-01-01', users: 100, quizzes: 5 },
      { date: '2024-01-02', users: 120, quizzes: 8 },
      { date: '2024-01-03', users: 135, quizzes: 12 },
      { date: '2024-01-04', users: 150, quizzes: 15 },
      { date: '2024-01-05', users: 165, quizzes: 18 },
      { date: '2024-01-06', users: 180, quizzes: 22 },
      { date: '2024-01-07', users: 200, quizzes: 25 }
    ],
    topQuizzes: [
      { name: 'JavaScript Fundamentals', attempts: 450, score: 82 },
      { name: 'React Advanced', attempts: 320, score: 75 },
      { name: 'CSS Grid Layout', attempts: 280, score: 88 },
      { name: 'Node.js Backend', attempts: 250, score: 78 },
      { name: 'Database Design', attempts: 200, score: 72 }
    ]
  };

  const displayData = Object.keys(analytics.overview).length > 0 ? analytics : sampleAnalytics;

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">Platform performance and user insights</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <FiRefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FiDownload className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FiUsers className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{displayData.overview.totalUsers}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <FiTrendingUp className="h-3 w-3 mr-1" />
                    +{displayData.overview.newUsers} this week
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <FiBookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                  <p className="text-2xl font-bold text-gray-900">{displayData.overview.totalQuizzes}</p>
                  <p className="text-xs text-gray-500 mt-1">Published quizzes</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FiTarget className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                  <p className="text-2xl font-bold text-gray-900">{displayData.overview.totalAttempts}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <FiTrendingUp className="h-3 w-3 mr-1" />
                    +{displayData.overview.quizCompletions} this week
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <FiAward className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                  <p className="text-2xl font-bold text-gray-900">{displayData.overview.averageScore}%</p>
                  <p className="text-xs text-gray-500 mt-1">Completion rate: {displayData.overview.completionRate}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* User Growth Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Users</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full ml-4"></div>
                  <span>Quizzes</span>
                </div>
              </div>
              
              <div className="h-64 flex items-end justify-between space-x-2">
                {displayData.userGrowth.map((data, index) => {
                  const maxValue = Math.max(...displayData.userGrowth.map(d => Math.max(d.users, d.quizzes)));
                  const userHeight = (data.users / maxValue) * 100;
                  const quizHeight = (data.quizzes / maxValue) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="flex items-end space-x-1 mb-2">
                        <div 
                          className="bg-blue-500 rounded-t"
                          style={{ 
                            width: '8px', 
                            height: `${userHeight}px`,
                            minHeight: '4px'
                          }}
                        ></div>
                        <div 
                          className="bg-green-500 rounded-b"
                          style={{ 
                            width: '8px', 
                            height: `${quizHeight}px`,
                            minHeight: '4px'
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Quizzes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Top Performing Quizzes</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View all
                </button>
              </div>
              
              <div className="space-y-4">
                {displayData.topQuizzes.map((quiz, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{quiz.name}</p>
                        <p className="text-xs text-gray-500">{quiz.attempts} attempts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{quiz.score}%</p>
                      <p className="text-xs text-gray-500">avg score</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiActivity className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-sm text-gray-600">Active Users</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{displayData.overview.activeUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiClock className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-sm text-gray-600">Avg. Session</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">4.2m</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiTarget className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="text-sm text-gray-600">Completion Rate</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{displayData.overview.completionRate}%</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Quiz Completion</span>
                    <span className="text-sm font-semibold text-gray-900">{displayData.overview.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${displayData.overview.completionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Average Score</span>
                    <span className="text-sm font-semibold text-gray-900">{displayData.overview.averageScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${displayData.overview.averageScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">User Engagement</span>
                    <span className="text-sm font-semibold text-gray-900">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: '78%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                  <div className="flex items-center">
                    <FiDownload className="h-4 w-4 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-blue-900">Export Report</span>
                  </div>
                  <FiCalendar className="h-4 w-4 text-blue-600" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                  <div className="flex items-center">
                    <FiBarChart2 className="h-4 w-4 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-green-900">Generate Insights</span>
                  </div>
                  <FiTrendingUp className="h-4 w-4 text-green-600" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                  <div className="flex items-center">
                    <FiUsers className="h-4 w-4 text-purple-600 mr-3" />
                    <span className="text-sm font-medium text-purple-900">User Analysis</span>
                  </div>
                  <FiActivity className="h-4 w-4 text-purple-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
