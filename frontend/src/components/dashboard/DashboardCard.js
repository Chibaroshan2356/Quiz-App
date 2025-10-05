import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  color = 'blue', 
  trend, 
  trendUp = true 
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-blue-100',
      text: 'text-blue-600',
      accent: 'text-blue-700'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'bg-green-100',
      text: 'text-green-600',
      accent: 'text-green-700'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'bg-purple-100',
      text: 'text-purple-600',
      accent: 'text-purple-700'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'bg-orange-100',
      text: 'text-orange-600',
      accent: 'text-orange-700'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`${colors.bg} rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <p className={`text-2xl font-bold ${colors.accent} mb-2`}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center space-x-1">
              {trendUp ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                trendUp ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend}
              </span>
              <span className="text-sm text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${colors.icon} p-3 rounded-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
