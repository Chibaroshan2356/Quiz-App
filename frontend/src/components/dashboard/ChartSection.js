import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, Users, Clock, Award } from 'lucide-react';

const ChartSection = ({ chartData }) => {
  // Use provided data or fallback to defaults
  const participantGrowthData = chartData?.participantGrowth || [
    { month: 'Jan', participants: 1200, quizzes: 8 },
    { month: 'Feb', participants: 1450, quizzes: 12 },
    { month: 'Mar', participants: 1680, quizzes: 15 },
    { month: 'Apr', participants: 1920, quizzes: 18 },
    { month: 'May', participants: 2100, quizzes: 22 },
    { month: 'Jun', participants: 1847, quizzes: 24 }
  ];

  const quizPerformanceData = chartData?.quizPerformance || [
    { name: 'JavaScript', score: 89, participants: 156 },
    { name: 'React', score: 76, participants: 98 },
    { name: 'CSS', score: 91, participants: 203 },
    { name: 'Node.js', score: 82, participants: 134 },
    { name: 'Python', score: 87, participants: 189 }
  ];

  const progressData = chartData?.progressMetrics || [
    { label: 'Quiz Completion Rate', value: 92.5, color: 'bg-blue-500' },
    { label: 'Average Score', value: 87.3, color: 'bg-green-500' },
    { label: 'User Engagement', value: 78.9, color: 'bg-purple-500' },
    { label: 'Retention Rate', value: 85.2, color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Performance Metrics
        </h3>
        <div className="space-y-4">
          {progressData.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {item.value}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className={`h-2 rounded-full ${item.color}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participant Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Participant Growth
            </h3>
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+12.5%</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={participantGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="participants"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quiz Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Quiz Performance
            </h3>
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <Award className="h-4 w-4" />
              <span>Top Scores</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quizPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="score" 
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Active Users</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Avg. Time</p>
              <p className="text-2xl font-bold">12.5 min</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Success Rate</p>
              <p className="text-2xl font-bold">94.2%</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChartSection;
