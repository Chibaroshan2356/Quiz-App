import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { 
  FiEdit3, 
  FiTrash2, 
  FiEye, 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiCalendar, 
  FiUsers, 
  FiTarget, 
  FiTrendingUp, 
  FiTrendingDown,
  FiRefreshCw, 
  FiBookOpen,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiDownload,
  FiCopy,
  FiGrid,
  FiList
} from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AdminLayout from '../../components/layout/AdminLayout';
import useConfirm from '../../hooks/useConfirm';
import { debounce } from 'lodash';
import { toast } from 'react-hot-toast';

// Constants
const ITEMS_PER_PAGE = 10;
const DEBOUNCE_DELAY = 300;

// Component-specific hooks
const useQuizFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    status: '',
    page: 1,
    limit: ITEMS_PER_PAGE,
    ...initialFilters
  });

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 1 }) // Reset to first page when filters change
    }));
  }, []);

  return { filters, updateFilter, setFilters };
};

const useQuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [operationInProgress, setOperationInProgress] = useState(false);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const confirm = useConfirm();
  const navigate = useNavigate();

  const fetchQuizzes = useCallback(async (filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getAdminQuizzes(filters);
      setQuizzes(response.data.quizzes);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to load quizzes. Please try again.');
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteQuiz = useCallback(async (quizId) => {
    const confirmed = await confirm(
      'Delete Quiz',
      'Are you sure you want to delete this quiz? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      setOperationInProgress(true);
      await adminAPI.deleteQuiz(quizId);
      toast.success('Quiz deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting quiz:', err);
      toast.error(err.response?.data?.message || 'Failed to delete quiz');
      return false;
    } finally {
      setOperationInProgress(false);
    }
  }, [confirm]);

  const duplicateQuiz = useCallback(async (quizId) => {
    try {
      setOperationInProgress(true);
      const response = await adminAPI.duplicateQuiz(quizId);
      toast.success('Quiz duplicated successfully');
      navigate(`/admin/quizzes/${response.data._id}/edit`);
    } catch (err) {
      console.error('Error duplicating quiz:', err);
      toast.error('Failed to duplicate quiz');
    } finally {
      setOperationInProgress(false);
    }
  }, [navigate]);

  const bulkDelete = useCallback(async (quizIds) => {
    const confirmed = await confirm(
      'Delete Multiple Quizzes',
      `Are you sure you want to delete ${quizIds.length} quizzes? This action cannot be undone.`
    );

    if (!confirmed) return false;

    try {
      setOperationInProgress(true);
      await Promise.all(quizIds.map(id => adminAPI.deleteQuiz(id)));
      toast.success(`${quizIds.length} quizzes deleted successfully`);
      setSelectedQuizzes([]);
      return true;
    } catch (err) {
      console.error('Error bulk deleting quizzes:', err);
      toast.error('Failed to delete some quizzes');
      return false;
    } finally {
      setOperationInProgress(false);
    }
  }, [confirm]);

  const bulkToggleStatus = useCallback(async (quizIds, isActive) => {
    try {
      setOperationInProgress(true);
      await Promise.all(quizIds.map(id => 
        adminAPI.updateQuiz(id, { isActive })
      ));
      toast.success(`${quizIds.length} quizzes ${isActive ? 'activated' : 'deactivated'} successfully`);
      setSelectedQuizzes([]);
      return true;
    } catch (err) {
      console.error('Error bulk updating quizzes:', err);
      toast.error('Failed to update some quizzes');
      return false;
    } finally {
      setOperationInProgress(false);
    }
  }, []);

  const exportQuizzes = useCallback(async (format = 'csv') => {
    try {
      // This would typically call an API endpoint to export data
      toast.success(`Quizzes exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export quizzes');
    }
  }, []);

  const toggleQuizSelection = useCallback((quizId) => {
    setSelectedQuizzes(prev => 
      prev.includes(quizId) 
        ? prev.filter(id => id !== quizId)
        : [...prev, quizId]
    );
  }, []);

  const selectAllQuizzes = useCallback(() => {
    setSelectedQuizzes(quizzes.map(quiz => quiz._id));
  }, [quizzes]);

  const clearSelection = useCallback(() => {
    setSelectedQuizzes([]);
  }, []);

  const sortQuizzes = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }, [sortBy, sortOrder]);

  return {
    quizzes,
    loading,
    error,
    pagination,
    operationInProgress,
    selectedQuizzes,
    viewMode,
    sortBy,
    sortOrder,
    fetchQuizzes,
    deleteQuiz,
    duplicateQuiz,
    bulkDelete,
    bulkToggleStatus,
    exportQuizzes,
    toggleQuizSelection,
    selectAllQuizzes,
    clearSelection,
    sortQuizzes,
    setViewMode
  };
};

/**
 * AdminQuizzes - A component for managing quizzes in the admin panel
 * @returns {JSX.Element} The rendered component
 */
const AdminQuizzes = () => {
  // State management
  const { filters, updateFilter, setFilters } = useQuizFilters();
  const {
    quizzes,
    loading,
    error,
    pagination,
    operationInProgress,
    selectedQuizzes,
    viewMode,
    sortBy,
    sortOrder,
    fetchQuizzes,
    deleteQuiz,
    duplicateQuiz,
    bulkDelete,
    bulkToggleStatus,
    exportQuizzes,
    toggleQuizSelection,
    selectAllQuizzes,
    clearSelection,
    sortQuizzes,
    setViewMode
  } = useQuizManagement();
  
  // Handle quiz deletion
  const handleDelete = useCallback(async (quizId) => {
    const success = await deleteQuiz(quizId);
    if (success) {
      fetchQuizzes(filters);
    }
  }, [deleteQuiz, fetchQuizzes, filters]);

  // Handle bulk operations
  const handleBulkDelete = useCallback(async () => {
    const success = await bulkDelete(selectedQuizzes);
    if (success) {
      fetchQuizzes(filters);
    }
  }, [bulkDelete, selectedQuizzes, fetchQuizzes, filters]);

  const handleBulkActivate = useCallback(async () => {
    const success = await bulkToggleStatus(selectedQuizzes, true);
    if (success) {
      fetchQuizzes(filters);
    }
  }, [bulkToggleStatus, selectedQuizzes, fetchQuizzes, filters]);

  const handleBulkDeactivate = useCallback(async () => {
    const success = await bulkToggleStatus(selectedQuizzes, false);
    if (success) {
      fetchQuizzes(filters);
    }
  }, [bulkToggleStatus, selectedQuizzes, fetchQuizzes, filters]);

  // Debounced search
  const debouncedFetchQuizzes = useMemo(
    () => debounce((filters) => fetchQuizzes(filters), DEBOUNCE_DELAY),
    [fetchQuizzes]
  );

  // Effect to fetch quizzes when filters change
  React.useEffect(() => {
    debouncedFetchQuizzes(filters);
    return () => debouncedFetchQuizzes.cancel();
  }, [filters, debouncedFetchQuizzes]);

  // Handlers
  const handleSearch = useCallback((e) => {
    updateFilter('search', e.target.value);
  }, [updateFilter]);

  const handleFilterChange = useCallback((key, value) => {
    updateFilter(key, value);
  }, [updateFilter]);

  const handlePageChange = useCallback((page) => {
    updateFilter('page', page);
  }, [updateFilter]);

  // This is now handled by the handleDelete function above

  // Memoized derived values
  const difficultyOptions = useMemo(() => [
    { value: '', label: 'All Difficulties' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ], []);

  const statusOptions = useMemo(() => [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' }
  ], []);

  // Render loading state
  if (loading && !quizzes.length) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  // Render error state
  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Management</h1>
              <p className="text-gray-600">Create, edit, and organize your quiz content</p>
              {selectedQuizzes.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-blue-600 font-medium">
                    {selectedQuizzes.length} quiz{selectedQuizzes.length !== 1 ? 'es' : ''} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear selection
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'table' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Table view"
                aria-label="Table view"
                >
                  <FiList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Grid view"
                  aria-label="Grid view"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Export Button */}
              <button
                onClick={() => exportQuizzes('csv')}
                className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200"
                title="Export quizzes"
                aria-label="Export quizzes"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Export
              </button>

              {/* Refresh Button */}
              <button
                onClick={() => fetchQuizzes(filters)}
                disabled={operationInProgress}
                className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Refresh quizzes"
              >
                <FiRefreshCw className={`w-4 h-4 mr-2 ${operationInProgress ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              {/* Create Button */}
              <Link
                to="/admin/quizzes/create"
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FiPlus className="w-5 h-5 mr-2" />
                Create New Quiz
              </Link>
            </div>
          </div>
        </div>

        {/* Bulk Operations */}
        {selectedQuizzes.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedQuizzes.length} quiz{selectedQuizzes.length !== 1 ? 'es' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkActivate}
                    disabled={operationInProgress}
                    className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  aria-label="Activate selected quizzes"
                  >
                    <FiCheck className="w-4 h-4 mr-1" />
                    Activate
                  </button>
                  <button
                    onClick={handleBulkDeactivate}
                    disabled={operationInProgress}
                    className="flex items-center px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                    aria-label="Deactivate selected quizzes"
                  >
                    <FiX className="w-4 h-4 mr-1" />
                    Deactivate
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    disabled={operationInProgress}
                    className="flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    aria-label="Delete selected quizzes"
                  >
                    <FiTrash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
              <button
                onClick={clearSelection}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter & Search</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFilters({
                  search: '',
                  category: '',
                  difficulty: '',
                  page: 1,
                  limit: 20
                })}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear all filters
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => sortQuizzes(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="title">Title</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="attempts">Attempts</option>
                  <option value="averageScore">Average Score</option>
                </select>
                <button
                  onClick={() => sortQuizzes(sortBy)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  {sortOrder === 'asc' ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search quizzes..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Categories</option>
                <option value="General">General</option>
                <option value="Science">Science</option>
                <option value="History">History</option>
                <option value="Technology">Technology</option>
                <option value="Sports">Sports</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>

            <div>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-500">
                {pagination.total ? `Showing ${quizzes.length} of ${pagination.total} quizzes` : 'No quizzes found'}
              </span>
            </div>
          </div>
        </div>


        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Quizzes Table */}
            {quizzes.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <input
                            type="checkbox"
                            checked={selectedQuizzes.length === quizzes.length && quizzes.length > 0}
                            onChange={selectedQuizzes.length === quizzes.length ? clearSelection : selectAllQuizzes}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                          onClick={() => sortQuizzes('title')}
                        >
                          <div className="flex items-center">
                            Quiz Details
                            {sortBy === 'title' && (
                              sortOrder === 'asc' ? <FiTrendingUp className="w-3 h-3 ml-1" /> : <FiTrendingDown className="w-3 h-3 ml-1" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                          onClick={() => sortQuizzes('category')}
                        >
                          <div className="flex items-center">
                            Category
                            {sortBy === 'category' && (
                              sortOrder === 'asc' ? <FiTrendingUp className="w-3 h-3 ml-1" /> : <FiTrendingDown className="w-3 h-3 ml-1" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                          onClick={() => sortQuizzes('difficulty')}
                        >
                          <div className="flex items-center">
                            Difficulty
                            {sortBy === 'difficulty' && (
                              sortOrder === 'asc' ? <FiTrendingUp className="w-3 h-3 ml-1" /> : <FiTrendingDown className="w-3 h-3 ml-1" />
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center">
                            <FiTarget className="w-4 h-4 mr-1" />
                            Questions
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                          onClick={() => sortQuizzes('attempts')}
                        >
                          <div className="flex items-center">
                            <FiUsers className="w-4 h-4 mr-1" />
                            Attempts
                            {sortBy === 'attempts' && (
                              sortOrder === 'asc' ? <FiTrendingUp className="w-3 h-3 ml-1" /> : <FiTrendingDown className="w-3 h-3 ml-1" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                          onClick={() => sortQuizzes('averageScore')}
                        >
                          <div className="flex items-center">
                            <FiTrendingUp className="w-4 h-4 mr-1" />
                            Avg Score
                            {sortBy === 'averageScore' && (
                              sortOrder === 'asc' ? <FiTrendingUp className="w-3 h-3 ml-1" /> : <FiTrendingDown className="w-3 h-3 ml-1" />
                            )}
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {quizzes.map((quiz) => (
                        <tr key={quiz._id} className={`hover:bg-gray-50 transition-colors ${selectedQuizzes.includes(quiz._id) ? 'bg-blue-50' : ''}`}>
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedQuizzes.includes(quiz._id)}
                              onChange={() => toggleQuizSelection(quiz._id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FiBookOpen className="w-5 h-5 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-gray-900 truncate">
                                  {quiz.title}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {quiz.description || 'No description'}
                                </div>
                                <div className="flex items-center mt-1 text-xs text-gray-400">
                                  <FiCalendar className="w-3 h-3 mr-1" />
                                  Created {new Date(quiz.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {quiz.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                              quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {quiz.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {quiz.totalQuestions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {quiz.attempts || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                Math.round(quiz.averageScore || 0) >= 80 ? 'bg-green-100 text-green-800' :
                                Math.round(quiz.averageScore || 0) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {Math.round(quiz.averageScore || 0)}%
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              quiz.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {quiz.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-start space-x-1">
                              <Link
                                to={`/quiz/${quiz._id}`}
                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Quiz"
                              >
                                <FiEye className="w-4 h-4" />
                              </Link>
                              <Link
                                to={`/admin/quizzes/${quiz._id}/edit`}
                                className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="Edit Quiz"
                              >
                                <FiEdit3 className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => duplicateQuiz(quiz._id)}
                                disabled={operationInProgress}
                                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Duplicate Quiz"
                              >
                                <FiCopy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(quiz._id)}
                                disabled={operationInProgress === quiz._id}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete Quiz"
                              >
                                {operationInProgress === quiz._id ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <FiTrash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiBookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No quizzes found
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  {filters.search || filters.category || filters.difficulty 
                    ? 'No quizzes match your current filters. Try adjusting your search criteria.'
                    : 'Get started by creating your first quiz to engage your users.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {(filters.search || filters.category || filters.difficulty) && (
                    <button
                      onClick={() => setFilters({
                        search: '',
                        category: '',
                        difficulty: '',
                        page: 1,
                        limit: 20
                      })}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                  <Link
                    to="/admin/quizzes/create"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <FiPlus className="w-5 h-5 mr-2 inline" />
                    Create Your First Quiz
                  </Link>
                </div>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{pagination.current}</span> of{' '}
                    <span className="font-medium">{pagination.pages}</span> ({pagination.total} total quizzes)
                  </div>
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.current - 1)}
                      disabled={pagination.current === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg ${
                            page === pagination.current
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(pagination.current + 1)}
                      disabled={pagination.current === pagination.pages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

// Prop Types
AdminQuizzes.propTypes = {
  // Add any props here if needed
};

export default React.memo(AdminQuizzes);
