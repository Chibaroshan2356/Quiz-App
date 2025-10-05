import React, { useState } from 'react';
import { 
  FiUsers, 
  FiBookOpen, 
  FiBarChart2, 
  FiSettings,
  FiLogOut,
  FiHome,
  FiPlus
} from 'react-icons/fi';

const SimpleAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <FiUsers className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <FiBookOpen className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <FiBarChart2 className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center">
                  <FiSettings className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Score</p>
                    <p className="text-2xl font-bold text-gray-900">0%</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveTab('users')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <FiUsers className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Manage Users</h3>
                  <p className="text-sm text-gray-600">View and manage user accounts</p>
                </button>
                
                <button 
                  onClick={() => setActiveTab('quizzes')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <FiBookOpen className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Manage Quizzes</h3>
                  <p className="text-sm text-gray-600">Create and edit quizzes</p>
                </button>
                
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                >
                  <FiBarChart2 className="h-6 w-6 text-purple-600 mb-2" />
                  <h3 className="font-medium text-gray-900">View Analytics</h3>
                  <p className="text-sm text-gray-600">Check platform statistics</p>
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'users':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>
            <div className="bg-white p-6 rounded-lg shadow border">
              <p className="text-gray-600">User management functionality will be implemented here.</p>
            </div>
          </div>
        );
        
      case 'quizzes':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Quiz Management</h1>
            <div className="bg-white p-6 rounded-lg shadow border">
              <p className="text-gray-600">Quiz management functionality will be implemented here.</p>
            </div>
          </div>
        );
        
      case 'analytics':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>
            <div className="bg-white p-6 rounded-lg shadow border">
              <p className="text-gray-600">Analytics functionality will be implemented here.</p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <button
                onClick={() => window.location.href = '/login'}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <FiLogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'dashboard' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FiHome className="mr-3 h-5 w-5" />
                Dashboard
              </button>
              
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'users' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FiUsers className="mr-3 h-5 w-5" />
                Users
              </button>
              
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'quizzes' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FiBookOpen className="mr-3 h-5 w-5" />
                Quizzes
              </button>
              
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'analytics' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FiBarChart2 className="mr-3 h-5 w-5" />
                Analytics
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SimpleAdmin;
