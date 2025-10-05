import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { 
  FiUsers, FiBookOpen, FiAward, FiBarChart2, FiTrendingUp, 
  FiClock, FiPlus, FiEye, FiEdit2, FiTrash2, FiRefreshCw
} from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from './components/StatCard';
import RecentActivity from './components/RecentActivity';
import TopQuizzes from './components/TopQuizzes';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    activeUsers: 0,
    totalAttempts: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [topQuizzes, setTopQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes, quizzesRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getRecentActivity(),
        adminAPI.getTopQuizzes()
      ]);

      setStats({
        totalUsers: statsRes.data.totalUsers || 0,
        totalQuizzes: statsRes.data.totalQuizzes || 0,
        activeUsers: statsRes.data.activeUsers || 0,
        totalAttempts: statsRes.data.totalAttempts || 0
      });

      setRecentActivity(activityRes.data || []);
      setTopQuizzes(quizzesRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={fetchDashboardData}
            className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={<FiUsers className="w-6 h-6" />}
            trend="+12.5%"
            trendType="up"
          />
          <StatCard 
            title="Total Quizzes" 
            value={stats.totalQuizzes} 
            icon={<FiBookOpen className="w-6 h-6" />}
            trend="+8.2%"
            trendType="up"
          />
          <StatCard 
            title="Active Users" 
            value={stats.activeUsers} 
            icon={<FiAward className="w-6 h-6" />}
            trend="+3.1%"
            trendType="up"
          />
          <StatCard 
            title="Total Attempts" 
            value={stats.totalAttempts} 
            icon={<FiBarChart2 className="w-6 h-6" />}
            trend="+24.3%"
            trendType="up"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <Link to="/admin/activity" className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </Link>
              </div>
              <RecentActivity activities={recentActivity} />
            </div>
          </div>

          {/* Top Quizzes */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Top Quizzes</h2>
                <Link to="/admin/quizzes" className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </Link>
              </div>
              <TopQuizzes quizzes={topQuizzes} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
