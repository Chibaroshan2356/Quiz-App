import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiEye, 
  FiUsers, 
  FiAward, 
  FiClock,
  FiTrendingUp,
  FiMoreHorizontal
} from 'react-icons/fi';

const TopQuizzes = ({ quizzes = [] }) => {
  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || colors.medium;
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  // Transform real data to quiz format
  const transformQuizzes = (quizData) => {
    return quizData.map(quiz => ({
      id: quiz._id,
      title: quiz.title,
      category: quiz.category,
      difficulty: quiz.difficulty,
      attempts: quiz.attemptCount || 0,
      averageScore: Math.round(quiz.averageScore || 0),
      completionRate: Math.round((quiz.attemptCount || 0) > 0 ? ((quiz.attemptCount || 0) / (quiz.attemptCount || 1)) * 100 : 0),
      lastAttempt: new Date()
    }));
  };

  const displayQuizzes = quizzes.length > 0 ? transformQuizzes(quizzes) : [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Quizzes</h3>
          <Link 
            to="/admin/quizzes"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        {displayQuizzes.length === 0 ? (
          <div className="text-center py-8">
            <FiAward className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No quizzes available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayQuizzes.slice(0, 5).map((quiz, index) => (
              <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {quiz.title}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{quiz.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <FiUsers className="h-4 w-4 mr-1 text-gray-400" />
                      {formatNumber(quiz.attempts)}
                    </div>
                    <p className="text-xs text-gray-500">Attempts</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <FiAward className="h-4 w-4 mr-1 text-gray-400" />
                      {quiz.averageScore}%
                    </div>
                    <p className="text-xs text-gray-500">Avg Score</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <FiTrendingUp className="h-4 w-4 mr-1" />
                      {quiz.completionRate}%
                    </div>
                    <p className="text-xs text-gray-500">Completion</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/admin/quizzes/${quiz.id}`}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    >
                      <FiEye className="h-4 w-4" />
                    </Link>
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200">
                      <FiMoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopQuizzes;