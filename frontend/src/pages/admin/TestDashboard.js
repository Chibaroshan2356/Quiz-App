import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

const TestDashboard = () => {
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">🎉 Admin Panel is Working!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Congratulations! Your admin panel is successfully loaded and functional.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Users</h3>
                <p className="text-3xl font-bold text-blue-600">0</p>
                <p className="text-sm text-blue-700">Total registered users</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Quizzes</h3>
                <p className="text-3xl font-bold text-green-600">0</p>
                <p className="text-sm text-green-700">Total quizzes created</p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Attempts</h3>
                <p className="text-3xl font-bold text-purple-600">0</p>
                <p className="text-sm text-purple-700">Total quiz attempts</p>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">Avg Score</h3>
                <p className="text-3xl font-bold text-orange-600">0%</p>
                <p className="text-sm text-orange-700">Average quiz score</p>
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a 
                  href="/admin/users" 
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">Manage Users</h4>
                  <p className="text-sm text-gray-600">View and manage user accounts</p>
                </a>
                
                <a 
                  href="/admin/quizzes" 
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">Manage Quizzes</h4>
                  <p className="text-sm text-gray-600">Create and edit quizzes</p>
                </a>
                
                <a 
                  href="/admin/analytics" 
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">View Analytics</h4>
                  <p className="text-sm text-gray-600">Check platform statistics</p>
                </a>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Create an admin user: <code className="bg-blue-100 px-1 rounded">node backend/scripts/createAdminUser.js</code></li>
                <li>• Access user management to view all users</li>
                <li>• Create your first quiz in the quiz management section</li>
                <li>• Check analytics for platform insights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TestDashboard;
