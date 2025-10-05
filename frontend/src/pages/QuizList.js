import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../services/api';
import { FiSearch, FiFilter, FiClock, FiBookOpen, FiArrowRight, FiStar } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({});

  // Fetch categories once on mount (they don't depend on filters)
  useEffect(() => {
    fetchCategories();
  }, []);

  // Debounce quiz fetching when filters change to avoid rate limits
  useEffect(() => {
    const id = setTimeout(() => {
      fetchQuizzes();
    }, 300);
    return () => clearTimeout(id);
  }, [filters]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getQuizzes(filters);
      setQuizzes(response.data.quizzes);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await quizAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: 'badge-easy',
      medium: 'badge-medium',
      hard: 'badge-hard'
    };
    return badges[difficulty] || 'badge-medium';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'text-green-600',
      medium: 'text-yellow-600',
      hard: 'text-red-600'
    };
    return colors[difficulty] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 display">
            Browse Quizzes
          </h1>
          <p className="text-gray-600">
            Test your knowledge with our collection of interactive quizzes
          </p>
        </div>

        {/* Filters */}
        <div className="surface p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search quizzes..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input pl-10 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="input"
              >
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({
                search: '',
                category: '',
                difficulty: '',
                page: 1,
                limit: 12
              })}
              className="btn btn-glass"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {pagination.total ? `Showing ${quizzes.length} of ${pagination.total} quizzes` : 'No quizzes found'}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Quizzes Grid */}
            {quizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {quizzes.map((quiz) => {
                  const accentClass =
                    quiz.difficulty === 'easy'
                      ? 'card-accent card-accent-easy'
                      : quiz.difficulty === 'hard'
                      ? 'card-accent card-accent-hard'
                      : 'card-accent card-accent-medium';
                  return (
                  <div key={quiz._id} className={`quiz-card surface ${accentClass}`}>
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`badge ${getDifficultyBadge(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <FiClock className="w-4 h-4 mr-1" />
                          {Math.ceil(quiz.timeLimit / 60)}m
                        </div>
                      </div>

                      {/* Title and Description */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {quiz.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {quiz.description || 'Test your knowledge with this engaging quiz.'}
                      </p>

                      {/* Meta Information */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <FiBookOpen className="w-4 h-4 mr-2" />
                          <span>{quiz.category}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{quiz.totalQuestions} questions</span>
                          <span className="mx-2">•</span>
                          <span>{quiz.totalPoints} points</span>
                        </div>
                        {quiz.averageScore > 0 && (
                          <div className="flex items-center text-sm text-gray-500">
                            <FiStar className="w-4 h-4 mr-1 text-yellow-500" />
                            <span>Avg: {Math.round(quiz.averageScore)}%</span>
                            <span className="mx-2">•</span>
                            <span>{quiz.attempts} attempts</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Link
                        to={`/quiz/${quiz._id}`}
                        className="btn btn-gradient w-full flex items-center justify-center"
                      >
                        Start Quiz
                        <FiArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                );})}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiBookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No quizzes found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search criteria or check back later for new quizzes.
                </p>
                <button
                  onClick={() => setFilters({
                    search: '',
                    category: '',
                    difficulty: '',
                    page: 1,
                    limit: 12
                  })}
                  className="btn btn-gradient"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.current - 1)}
                    disabled={pagination.current === 1}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`btn ${
                        page === pagination.current
                          ? 'btn-primary'
                          : 'btn-secondary'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.current + 1)}
                    disabled={pagination.current === pagination.pages}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizList;
