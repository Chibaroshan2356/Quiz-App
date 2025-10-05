import React from 'react';
import { 
  FiUser, 
  FiBookOpen, 
  FiAward, 
  FiClock, 
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye
} from 'react-icons/fi';

const RecentActivity = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    const icons = {
      'user_registered': FiUser,
      'quiz_created': FiBookOpen,
      'quiz_completed': FiAward,
      'quiz_updated': FiEdit2,
      'quiz_deleted': FiTrash2,
      'quiz_viewed': FiEye,
      'default': FiClock
    };
    return icons[type] || icons.default;
  };

  const getActivityColor = (type) => {
    const colors = {
      'user_registered': 'text-blue-600 bg-blue-100',
      'quiz_created': 'text-green-600 bg-green-100',
      'quiz_completed': 'text-purple-600 bg-purple-100',
      'quiz_updated': 'text-orange-600 bg-orange-100',
      'quiz_deleted': 'text-red-600 bg-red-100',
      'quiz_viewed': 'text-indigo-600 bg-indigo-100',
      'default': 'text-gray-600 bg-gray-100'
    };
    return colors[type] || colors.default;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Transform real data to activity format
  const transformActivities = (scores) => {
    return scores.map(score => ({
      id: score._id,
      type: 'quiz_completed',
      user: score.user?.name || 'Unknown User',
      description: `completed "${score.quiz?.title || 'Quiz'}" quiz`,
      score: score.percentage,
      timestamp: new Date(score.completedAt)
    }));
  };

  const displayActivities = activities.length > 0 ? transformActivities(activities) : [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {displayActivities.length === 0 ? (
          <div className="text-center py-8">
            <FiClock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayActivities.slice(0, 5).map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 p-2 rounded-full ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span>{' '}
                        {activity.description}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    {activity.score && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Score: {activity.score}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;