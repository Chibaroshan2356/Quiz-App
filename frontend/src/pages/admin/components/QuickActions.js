import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPlus, 
  FiUsers, 
  FiBarChart2, 
  FiSettings,
  FiBookOpen,
  FiDownload,
  FiUpload,
  FiZap
} from 'react-icons/fi';

const QuickActions = () => {
  const actions = [
    {
      title: 'Create Quiz',
      description: 'Start building a new quiz',
      icon: FiPlus,
      href: '/admin/quizzes/new',
      color: 'blue'
    },
    {
      title: 'Manage Users',
      description: 'View and manage users',
      icon: FiUsers,
      href: '/admin/users',
      color: 'green'
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics',
      icon: FiBarChart2,
      href: '/admin/analytics',
      color: 'purple'
    },
    {
      title: 'Quiz Templates',
      description: 'Use pre-built templates',
      icon: FiZap,
      href: '/admin/templates',
      color: 'orange'
    },
    {
      title: 'Export Data',
      description: 'Download reports',
      icon: FiDownload,
      href: '/admin/export',
      color: 'indigo'
    },
    {
      title: 'Settings',
      description: 'Configure platform',
      icon: FiSettings,
      href: '/admin/settings',
      color: 'gray'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      green: 'bg-green-100 text-green-600 hover:bg-green-200',
      purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
      orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
      indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
      gray: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-600 mt-1">Common admin tasks</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            const colorClasses = getColorClasses(action.color);
            
            return (
              <Link
                key={index}
                to={action.href}
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
              >
                <div className={`p-2 rounded-lg ${colorClasses} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    {action.title}
                  </p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Need help?</span>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
