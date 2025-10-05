import React from 'react';
import { FiTrendingUp, FiUsers, FiAward } from 'react-icons/fi';

const PerformanceChart = () => {
  // Sample data for the last 7 days
  const performanceData = [
    { day: 'Mon', users: 45, quizzes: 12, completions: 38 },
    { day: 'Tue', users: 52, quizzes: 15, completions: 42 },
    { day: 'Wed', users: 48, quizzes: 18, completions: 35 },
    { day: 'Thu', users: 61, quizzes: 22, completions: 48 },
    { day: 'Fri', users: 55, quizzes: 19, completions: 41 },
    { day: 'Sat', users: 38, quizzes: 14, completions: 28 },
    { day: 'Sun', users: 42, quizzes: 16, completions: 32 }
  ];

  const maxValue = Math.max(...performanceData.map(d => Math.max(d.users, d.quizzes, d.completions)));

  const getBarHeight = (value) => {
    return (value / maxValue) * 100;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Users</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Quizzes</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Completions</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-end justify-between h-64 space-x-2">
          {performanceData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="flex flex-col items-center space-y-1 mb-2">
                <div className="flex items-center space-x-2">
                  <div 
                    className="bg-blue-500 rounded-t"
                    style={{ 
                      width: '8px', 
                      height: `${getBarHeight(data.users)}px`,
                      minHeight: '4px'
                    }}
                  ></div>
                  <div 
                    className="bg-green-500"
                    style={{ 
                      width: '8px', 
                      height: `${getBarHeight(data.quizzes)}px`,
                      minHeight: '4px'
                    }}
                  ></div>
                  <div 
                    className="bg-purple-500 rounded-b"
                    style={{ 
                      width: '8px', 
                      height: `${getBarHeight(data.completions)}px`,
                      minHeight: '4px'
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-500 font-medium">{data.day}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <FiUsers className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-blue-600">
                {performanceData.reduce((sum, d) => sum + d.users, 0)}
              </span>
            </div>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <FiAward className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-green-600">
                {performanceData.reduce((sum, d) => sum + d.quizzes, 0)}
              </span>
            </div>
            <p className="text-sm text-gray-600">Quizzes Created</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <FiTrendingUp className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-2xl font-bold text-purple-600">
                {performanceData.reduce((sum, d) => sum + d.completions, 0)}
              </span>
            </div>
            <p className="text-sm text-gray-600">Completions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
