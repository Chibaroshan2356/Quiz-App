import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiList, FiSettings, FiBarChart2, FiUpload, FiCopy } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';

const QuizAdmin = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Quiz Management</h1>
          <Link 
            to="/admin/quizzes/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" /> Create New Quiz
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Create Quiz
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'manage'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Manage Quizzes
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'create' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Create New Quiz</h2>
                <p className="text-gray-600">
                  Create a new quiz by clicking the "Create New Quiz" button above or choose from the options below:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  <Link 
                    to="/admin/quizzes/new/manual"
                    className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="text-blue-600 mb-3">
                      <FiPlus className="w-8 h-8" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Create Manually</h3>
                    <p className="text-sm text-gray-500">Build a quiz from scratch with full customization</p>
                  </Link>
                  
                  <Link 
                    to="/admin/quizzes/new/import"
                    className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="text-green-600 mb-3">
                      <FiUpload className="w-8 h-8" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Import Quiz</h3>
                    <p className="text-sm text-gray-500">Import questions from a file (CSV, JSON, etc.)</p>
                  </Link>
                  
                  <Link 
                    to="/admin/quizzes/new/duplicate"
                    className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="text-purple-600 mb-3">
                      <FiCopy className="w-8 h-8" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">Duplicate Quiz</h3>
                    <p className="text-sm text-gray-500">Make a copy of an existing quiz</p>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'manage' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Manage Quizzes</h2>
                <Link 
                  to="/admin/quizzes"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  View all quizzes <FiList className="ml-2" />
                </Link>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Quiz Analytics</h2>
                <p className="text-gray-600">View detailed analytics and performance metrics for your quizzes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default QuizAdmin;
