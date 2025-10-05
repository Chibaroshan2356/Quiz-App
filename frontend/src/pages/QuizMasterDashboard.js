import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertCircle } from 'lucide-react';
import Navbar from '../components/dashboard/Navbar';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardCard from '../components/dashboard/DashboardCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import CreateQuizModal from '../components/dashboard/CreateQuizModal';
import ChartSection from '../components/dashboard/ChartSection';
import { useDashboardData } from '../hooks/useDashboardData';

const QuizMasterDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  // Use custom hook for data management
  const { data, loading, error, refreshData } = useDashboardData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onCreateQuiz={() => setCreateModalOpen(true)}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back! 👋
                  </h1>
                  <p className="text-gray-600">
                    Here's what's happening with your quizzes today.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={refreshData}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3"
              >
                <AlertCircle className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-blue-800 font-medium">Demo Mode - Using Sample Data</p>
                  <p className="text-blue-600 text-sm">
                    {error.includes('authentication') 
                      ? 'Not logged in - showing demo data. Log in to see your real quiz data.'
                      : 'Unable to connect to server - showing demo data.'}
                  </p>
                </div>
                <button
                  onClick={refreshData}
                  className="ml-auto text-blue-600 hover:text-blue-800 font-medium"
                >
                  Refresh
                </button>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && !data.stats && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center py-12"
              >
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading dashboard data...</p>
                </div>
              </motion.div>
            )}

            {/* Dashboard Content */}
            {!loading && data.stats && (
              <>
                {/* Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                  <DashboardCard
                    title="Total Quizzes"
                    value={data.stats.totalQuizzes}
                    icon="📚"
                    color="blue"
                    trend="+12%"
                    trendUp={true}
                  />
                  <DashboardCard
                    title="Total Participants"
                    value={data.stats.totalParticipants.toLocaleString()}
                    icon="👥"
                    color="green"
                    trend="+8%"
                    trendUp={true}
                  />
                  <DashboardCard
                    title="Average Score"
                    value={`${data.stats.averageScore}%`}
                    icon="⭐"
                    color="purple"
                    trend="+3%"
                    trendUp={true}
                  />
                  <DashboardCard
                    title="Completion Rate"
                    value={`${data.stats.completionRate}%`}
                    icon="🎯"
                    color="orange"
                    trend="+5%"
                    trendUp={true}
                  />
                </motion.div>

                {/* Charts and Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Charts Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-2"
                  >
                    <ChartSection chartData={data.chartData} />
                  </motion.div>

                  {/* Recent Activity */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="lg:col-span-1"
                  >
                    <RecentActivity activities={data.recentActivity} />
                  </motion.div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Create Quiz Modal */}
      <AnimatePresence>
        {createModalOpen && (
          <CreateQuizModal
            isOpen={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizMasterDashboard;
