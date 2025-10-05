import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { 
  FiArrowLeft, FiEdit, FiTrash2, FiClock, FiBarChart2, 
  FiCheck, FiX, FiUsers, FiList, FiHash, FiAlertCircle, FiCopy
} from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { format } from 'date-fns';

const QuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    completionRate: 0,
    averageTime: 0
  });
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isCloning, setIsCloning] = useState(false);

  useEffect(() => {
    fetchQuizDetails();
    fetchQuizStats();
    fetchRecentAttempts();
  }, [id]);

  const fetchQuizDetails = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getQuizDetails(id);
      setQuiz(response.data);
    } catch (error) {
      console.error('Error fetching quiz details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizStats = async () => {
    try {
      const response = await adminAPI.getQuizStats(id);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
    }
  };

  const fetchRecentAttempts = async () => {
    try {
      const response = await adminAPI.getQuizAttempts(id, { limit: 5 });
      setRecentAttempts(response.data);
    } catch (error) {
      console.error('Error fetching recent attempts:', error);
    }
  };

  const handlePublishToggle = async () => {
    if (!quiz) return;
    
    try {
      setIsPublishing(true);
      const newStatus = quiz.status === 'published' ? 'draft' : 'published';
      await adminAPI.updateQuiz(quiz._id, { status: newStatus });
      setQuiz({ ...quiz, status: newStatus });
      // Show success message
    } catch (error) {
      console.error('Error updating quiz status:', error);
      // Show error message
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminAPI.deleteQuiz(id);
      navigate('/admin/quizzes');
      // Show success message
    } catch (error) {
      console.error('Error deleting quiz:', error);
      // Show error message
    }
  };

  const handleClone = async () => {
    if (!quiz) return;
    
    try {
      setIsCloning(true);
      const response = await adminAPI.cloneQuiz(id);
      navigate(`/admin/quizzes/${response.data._id}/edit`);
      // Show success message
    } catch (error) {
      console.error('Error cloning quiz:', error);
      // Show error message
    } finally {
      setIsCloning(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!quiz) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Quiz not found</h2>
          <p className="mt-2 text-gray-600">The requested quiz could not be found.</p>
          <Link
            to="/admin/quizzes"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Quizzes
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center">
            <Link
              to="/admin/quizzes"
              className="mr-4 text-gray-400 hover:text-gray-500"
            >
              <FiArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
            <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              quiz.status === 'published' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {quiz.status === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {quiz.description || 'No description provided'}
          </p>
        </div>
        <div className="mt-3 flex sm:mt-0 sm:ml-4 space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handlePublishToggle}
            disabled={isPublishing}
          >
            {isPublishing ? (
              'Processing...'
            ) : quiz.status === 'published' ? (
              <>
                <FiX className="-ml-1 mr-2 h-5 w-5 text-yellow-500" />
                Unpublish
              </>
            ) : (
              <>
                <FiCheck className="-ml-1 mr-2 h-5 w-5 text-green-500" />
                Publish
              </>
            )}
          </button>
          <Link
            to={`/admin/quizzes/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiEdit className="-ml-1 mr-2 h-5 w-5" />
            Edit
          </Link>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            onClick={handleClone}
            disabled={isCloning}
          >
            <FiCopy className="-ml-1 mr-2 h-5 w-5" />
            {isCloning ? 'Cloning...' : 'Clone'}
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={() => setShowDeleteModal(true)}
          >
            <FiTrash2 className="-ml-1 mr-2 h-5 w-5" />
            Delete
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Quiz Information
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Category</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {quiz.category || 'Uncategorized'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Difficulty</h4>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {quiz.difficulty || 'Not specified'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Time Limit</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {quiz.timeLimit ? `${quiz.timeLimit} minutes` : 'No time limit'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Passing Score</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {quiz.passingScore ? `${quiz.passingScore}%` : 'Not specified'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {format(new Date(quiz.createdAt), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {format(new Date(quiz.updatedAt), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              {quiz.questions && quiz.questions.length > 0 ? (
                <div className="mt-8">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Questions ({quiz.questions.length})</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ol className="list-decimal list-inside space-y-4">
                      {quiz.questions.map((question, index) => (
                        <li key={question._id || index} className="text-sm text-gray-900">
                          <div className="flex items-start">
                            <span className="font-medium mr-2">{index + 1}.</span>
                            <div>
                              <div className="font-medium">{question.text}</div>
                              {question.hint && (
                                <div className="text-xs text-gray-500 mt-1">
                                  <span className="font-medium">Hint:</span> {question.hint}
                                </div>
                              )}
                              <div className="mt-2 text-xs">
                                <span className="font-medium">Type:</span> {question.type}
                                {question.points && (
                                  <span className="ml-2">
                                    <span className="font-medium">Points:</span> {question.points}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="mt-8 text-center py-8 bg-gray-50 rounded-lg">
                  <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No questions</h3>
                  <p className="mt-1 text-sm text-gray-500">This quiz doesn't have any questions yet.</p>
                  <div className="mt-6">
                    <Link
                      to={`/admin/quizzes/${id}/edit`}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiEdit className="-ml-1 mr-2 h-5 w-5" />
                      Add Questions
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column */}
        <div className="space-y-5">
          {/* Stats */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Quiz Statistics
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <dl className="space-y-6">
                <div className="relative">
                  <dt className="text-sm font-medium text-gray-500">
                    <div className="absolute bg-blue-500 rounded-md p-3">
                      <FiUsers className="h-6 w-6 text-white" />
                    </div>
                    <p className="ml-16">Total Attempts</p>
                  </dt>
                  <dd className="ml-16 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.totalAttempts}
                    </p>
                  </dd>
                </div>
                
                <div className="relative">
                  <dt className="text-sm font-medium text-gray-500">
                    <div className="absolute bg-green-500 rounded-md p-3">
                      <FiBarChart2 className="h-6 w-6 text-white" />
                    </div>
                    <p className="ml-16">Average Score</p>
                  </dt>
                  <dd className="ml-16 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.averageScore ? `${Math.round(stats.averageScore)}%` : 'N/A'}
                    </p>
                  </dd>
                </div>
                
                <div className="relative">
                  <dt className="text-sm font-medium text-gray-500">
                    <div className="absolute bg-yellow-500 rounded-md p-3">
                      <FiCheck className="h-6 w-6 text-white" />
                    </div>
                    <p className="ml-16">Completion Rate</p>
                  </dt>
                  <dd className="ml-16 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.completionRate ? `${Math.round(stats.completionRate)}%` : 'N/A'}
                    </p>
                  </dd>
                </div>
                
                <div className="relative">
                  <dt className="text-sm font-medium text-gray-500">
                    <div className="absolute bg-purple-500 rounded-md p-3">
                      <FiClock className="h-6 w-6 text-white" />
                    </div>
                    <p className="ml-16">Average Time</p>
                  </dt>
                  <dd className="ml-16 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatTime(stats.averageTime)}
                    </p>
                  </dd>
                </div>
              </dl>
              
              <div className="mt-6">
                <Link
                  to={`/admin/quizzes/${id}/results`}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiList className="-ml-1 mr-2 h-5 w-5" />
                  View All Results
                </Link>
              </div>
            </div>
          </div>
          
          {/* Recent Attempts */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Attempts
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {recentAttempts.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {recentAttempts.map((attempt) => (
                    <li key={attempt._id} className="py-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FiUser className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {attempt.user?.name || 'Anonymous User'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {format(new Date(attempt.completedAt), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            attempt.score >= (quiz.passingScore || 70) 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {attempt.score}%
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <FiAlertCircle className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    No attempts have been made on this quiz yet.
                  </p>
                </div>
              )}
              
              {recentAttempts.length > 0 && (
                <div className="mt-4 text-center">
                  <Link
                    to={`/admin/quizzes/${id}/results`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View all attempts
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <FiTrash2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Quiz
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this quiz? This action cannot be undone and will also delete all associated attempts and results.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

// Helper function to format time
export function formatTime(seconds) {
  if (!seconds) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  let result = [];
  if (hours > 0) result.push(`${hours}h`);
  if (minutes > 0) result.push(`${minutes}m`);
  if (secs > 0 || result.length === 0) result.push(`${secs}s`);
  
  return result.join(' ');
}

export default QuizDetails;
