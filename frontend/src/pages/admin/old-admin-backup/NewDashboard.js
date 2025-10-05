import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { 
  FiUsers, 
  FiBookOpen, 
  FiAward, 
  FiBarChart2, 
  FiTrendingUp, 
  FiClock,
  FiActivity,
  FiTarget,
  FiZap,
  FiChevronRight,
  FiSettings,
  FiPlus,
  FiDownload,
  FiCalendar
} from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Card Components
const StatCard = ({ title, value, icon: Icon, color = 'blue', trend = 0, trendLabel = '' }) => {
  const colors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    green: { bg: 'bg-green-50', text: 'text-green-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]?.bg || 'bg-blue-50'}`}>
          <Icon className={`h-6 w-6 ${colors[color]?.text || 'text-blue-600'}`} />
        </div>
      </div>
      {trend !== 0 && (
        <div className="mt-4 flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {trend > 0 ? (
              <FiTrendingUp className="-ml-0.5 mr-1 h-3 w-3" />
            ) : (
              <FiTrendingUp className="-ml-0.5 mr-1 h-3 w-3 transform rotate-180" />
            )}
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="ml-2 text-xs text-gray-500">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

const RecentActivityItem = ({ activity }) => (
  <div className="flex items-start pb-4 last:pb-0 group">
    <div className="flex-shrink-0 mt-1">
      <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
        <FiActivity className="h-4 w-4 text-blue-600" />
      </div>
    </div>
    <div className="ml-3 flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
      <p className="text-sm text-gray-500">{activity.description}</p>
      <div className="mt-1 flex items-center text-xs text-gray-400">
        <FiClock className="flex-shrink-0 mr-1 h-3 w-3" />
        <span>{activity.time}</span>
      </div>
    </div>
  </div>
);

const TopQuizCard = ({ quiz, index }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 last:pb-0 first:pt-0 group hover:bg-gray-50 -mx-2 px-2 rounded transition-colors">
    <div className="flex items-center min-w-0">
      <span className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium ${
        index < 3 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {index + 1}
      </span>
      <div className="ml-3 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{quiz.title}</p>
        <p className="text-xs text-gray-500 flex items-center">
          <span className="truncate">{quiz.category}</span>
        </p>
      </div>
    </div>
    <div className="flex-shrink-0 ml-2">
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {quiz.participants} participants
      </span>
    </div>
  </div>
);

const QuickActionCard = ({ title, description, icon: Icon, to, color = 'blue' }) => {
  const colors = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'hover:border-blue-500' },
    green: { bg: 'bg-green-50', text: 'text-green-600', hover: 'hover:border-green-500' },
    purple: { bg: 'purple-50', text: 'text-purple-600', hover: 'hover:border-purple-500' }
  };

  return (
    <Link 
      to={to}
      className={`p-4 border border-gray-200 rounded-lg transition-all duration-200 ${colors[color]?.hover} hover:shadow-sm`}
    >
      <div className="flex items-start">
        <div className={`p-2.5 rounded-lg ${colors[color]?.bg} ${colors[color]?.text}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-4">
          <h3 className="text-base font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  );
};

const NewDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentActivity: [],
    topQuizzes: [],
    isLoading: true,
    dateRange: 'This month'
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call with mock data
        const mockData = {
          overview: {
            totalUsers: 1242,
            totalQuizzes: 89,
            totalAttempts: 4523,
            avgScore: 78.5
          },
          recentActivity: [
            {
              id: 1,
              title: 'New user registered',
              description: 'John Doe created an account',
              time: '2 minutes ago'
            },
            {
              id: 2,
              title: 'Quiz completed',
              description: 'Jane Smith completed "JavaScript Basics" with 85% score',
              time: '1 hour ago'
            },
            {
              id: 3,
              title: 'New quiz created',
              description: 'Admin created a new quiz "React Advanced"',
              time: '3 hours ago'
            }
          ],
          topQuizzes: [
            { id: 1, title: 'JavaScript Fundamentals', category: 'Programming', participants: 1242 },
            { id: 2, title: 'CSS Grid Mastery', category: 'Web Development', participants: 987 },
            { id: 3, title: 'React Hooks', category: 'Frontend', participants: 845 },
            { id: 4, title: 'Node.js Basics', category: 'Backend', participants: 621 },
            { id: 5, title: 'MongoDB Essentials', category: 'Database', participants: 532 }
          ]
        };

        setDashboardData(prev => ({
          ...prev,
          stats: mockData.overview,
          recentActivity: mockData.recentActivity,
          topQuizzes: mockData.topQuizzes,
          isLoading: false
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  if (dashboardData.isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <FiDownload className="h-4 w-4 mr-1.5" />
              Export
            </button>
            <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <FiPlus className="h-4 w-4 mr-1.5" />
              Create
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard 
            title="Total Users" 
            value={dashboardData.stats.totalUsers.toLocaleString()} 
            icon={FiUsers} 
            color="blue"
            trend={12.5}
            trendLabel="vs last month"
          />
          <StatCard 
            title="Total Quizzes" 
            value={dashboardData.stats.totalQuizzes} 
            icon={FiBookOpen} 
            color="green"
            trend={5.2}
            trendLabel="new this month"
          />
          <StatCard 
            title="Quiz Attempts" 
            value={dashboardData.stats.totalAttempts.toLocaleString()} 
            icon={FiTarget} 
            color="purple"
            trend={18.3}
            trendLabel="vs last month"
          />
          <StatCard 
            title="Avg. Score" 
            value={`${dashboardData.stats.avgScore}%`} 
            icon={FiAward} 
            color="yellow"
            trend={2.5}
            trendLabel="improvement"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center">
                View All
                <FiChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((activity) => (
                  <RecentActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <div className="text-center py-8">
                  <FiActivity className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Quizzes */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Top Quizzes</h2>
              <Link to="/admin/quizzes" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center">
                View All
                <FiChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-1">
              {dashboardData.topQuizzes.length > 0 ? (
                dashboardData.topQuizzes.map((quiz, index) => (
                  <TopQuizCard key={quiz.id} quiz={quiz} index={index} />
                ))
              ) : (
                <div className="text-center py-8">
                  <FiBookOpen className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">No quizzes available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionCard 
              title="Create New Quiz" 
              description="Design and publish a new quiz"
              icon={FiBookOpen}
              to="/admin/quizzes/create"
              color="blue"
            />
            <QuickActionCard 
              title="Manage Users" 
              description="View and manage user accounts"
              icon={FiUsers}
              to="/admin/users"
              color="green"
            />
            <QuickActionCard 
              title="Platform Settings" 
              description="Configure system settings"
              icon={FiSettings}
              to="/admin/settings"
              color="purple"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewDashboard;
