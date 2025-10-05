import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiBookOpen, 
  FiAward, 
  FiBarChart2, 
  FiTrendingUp, 
  FiClock, 
  FiPlus, 
  FiEye, 
  FiEdit2, 
  FiTrash2, 
  FiRefreshCw,
  FiActivity,
  FiTarget,
  FiZap,
  FiChevronRight,
  FiCalendar,
  FiDollarSign
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { adminAPI, quizAPI } from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from './components/StatCard';
import RecentActivity from './components/RecentActivity';
import TopQuizzes from './components/TopQuizzes';
import QuickActions from './components/QuickActions';
import PerformanceChart from './components/PerformanceChart';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    activeUsers: 0,
    totalAttempts: 0,
    averageScore: 0,
    completionRate: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [topQuizzes, setTopQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      const data = response.data;

      setStats({
        totalUsers: data.overview?.totalUsers || 0,
        totalQuizzes: data.overview?.totalQuizzes || 0,
        activeUsers: data.overview?.activeUsers || 0,
        totalAttempts: data.overview?.totalAttempts || 0,
        averageScore: data.overview?.averageScore || 0,
        completionRate: data.overview?.completionRate || 0
      });

      setRecentActivity(data.recentActivity || []);
      setTopQuizzes(data.topQuizzes || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Set fallback data if API fails
      setStats({
        totalUsers: 0,
        totalQuizzes: 0,
        activeUsers: 0,
        totalAttempts: 0,
        averageScore: 0,
        completionRate: 0
      });
      setRecentActivity([]);
      setTopQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success('Dashboard refreshed');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          {/* Welcome Section with Actions */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back! 👋</h1>
              <p className="text-gray-600">Here's what's happening with your quiz platform.</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <FiRefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={FiUsers}
              color="blue"
              trend={{ value: 12, isPositive: true }}
              subtitle="Registered users"
            />
            <StatCard
              title="Total Quizzes"
              value={stats.totalQuizzes}
              icon={FiBookOpen}
              color="green"
              trend={{ value: 8, isPositive: true }}
              subtitle="Published quizzes"
            />
            <StatCard
              title="Active Users"
              value={stats.activeUsers}
              icon={FiActivity}
              color="purple"
              trend={{ value: 15, isPositive: true }}
              subtitle="This month"
            />
            <StatCard
              title="Total Attempts"
              value={stats.totalAttempts}
              icon={FiTarget}
              color="orange"
              trend={{ value: 23, isPositive: true }}
              subtitle="Quiz attempts"
            />
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FiAward className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-green-600">
                  <FiTrendingUp className="h-4 w-4 mr-1" />
                  <span>+5.2% from last month</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.completionRate}%</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FiBarChart2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-blue-600">
                  <FiTrendingUp className="h-4 w-4 mr-1" />
                  <span>+2.1% from last month</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                  <p className="text-3xl font-bold text-gray-900">4.2m</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <FiClock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-orange-600">
                  <FiTrendingUp className="h-4 w-4 mr-1" />
                  <span>-0.3m from last month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <RecentActivity activities={recentActivity} />
            </div>

            {/* Quick Actions */}
            <div>
              <QuickActions />
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Quizzes */}
            <div>
              <TopQuizzes quizzes={topQuizzes} />
            </div>

            {/* Performance Chart */}
            <div>
              <PerformanceChart />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
