import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { quizAPI } from '../services/api';
import { FiBookOpen, FiAward, FiClock, FiUsers, FiStar, FiArrowRight } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [featuredQuizzes, setFeaturedQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesResponse, categoriesResponse] = await Promise.all([
          quizAPI.getQuizzes({ limit: 6 }),
          quizAPI.getCategories()
        ]);
        
        setFeaturedQuizzes(quizzesResponse.data.quizzes);
        setCategories(categoriesResponse.data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: FiBookOpen,
      title: 'Interactive Quizzes',
      description: 'Test your knowledge with our engaging quiz format'
    },
    {
      icon: FiClock,
      title: 'Timed Challenges',
      description: 'Race against the clock to improve your speed'
    },
    {
      icon: FiAward,
      title: 'Leaderboards',
      description: 'Compete with others and climb the rankings'
    },
    {
      icon: FiUsers,
      title: 'Community',
      description: 'Join thousands of learners worldwide'
    }
  ];

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: 'badge-easy',
      medium: 'badge-medium',
      hard: 'badge-hard'
    };
    return badges[difficulty] || 'badge-medium';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div className="hero-blob" />
        <div className="section text-center">
          <span className="kicker">Welcome</span>
          <h1 className="display text-4xl md:text-6xl mb-4 text-gradient">Test Your Knowledge</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Challenge yourself with interactive quizzes on various topics. Learn, compete, and track your progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quizzes" className="btn btn-gradient text-lg px-8 py-3">Browse Quizzes</Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-glass text-lg px-8 py-3">Get Started</Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 display">
              Why Choose Quizmaster?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers everything you need to enhance your learning experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center surface p-8">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
                    <Icon className="w-8 h-8 text-primary-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Quizzes Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 display">
              Featured Quizzes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular quizzes across different categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredQuizzes.map((quiz) => {
              const accentClass =
                quiz.difficulty === 'easy'
                  ? 'card-accent card-accent-easy'
                  : quiz.difficulty === 'hard'
                  ? 'card-accent card-accent-hard'
                  : 'card-accent card-accent-medium';
              return (
              <div key={quiz._id} className={`quiz-card surface ${accentClass}`}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`badge ${getDifficultyBadge(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <FiClock className="w-4 h-4 mr-1" />
                      {Math.ceil(quiz.timeLimit / 60)} min
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {quiz.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {quiz.description || 'Test your knowledge with this engaging quiz.'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {quiz.totalQuestions} questions
                    </span>
                    <Link
                      to={`/quiz/${quiz._id}`}
                      className="flex items-center btn-gradient rounded-full px-4 py-2 text-white font-medium"
                    >
                      Start Quiz
                      <FiArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );})}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/quizzes"
              className="btn btn-primary text-lg px-8 py-3"
            >
              View All Quizzes
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 display">
              Explore Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find quizzes that match your interests and learning goals
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/quizzes?category=${encodeURIComponent(category)}`}
                className="p-6 rounded-xl border border-transparent transition-all duration-200 text-center group surface hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 bg-white/70 group-hover:bg-white transition-colors">
                  <FiBookOpen className="w-6 h-6 text-primary-700" />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-primary-700">
                  {category}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 display">
              Ready to Start Learning?
            </h2>
            <p className="text-xl mb-8 text-gray-600">
              Join thousands of learners and start your quiz journey today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-gradient text-lg px-8 py-3">
                Create Account
              </Link>
              <Link
                to="/login"
                className="btn btn-glass text-lg px-8 py-3"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
