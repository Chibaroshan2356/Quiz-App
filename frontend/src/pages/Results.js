import React, { useState, useEffect } from 'react';
import useAudioManager from '../hooks/useAudioManager';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { scoreAPI, quizAPI } from '../services/api';
import { FiAward, FiClock, FiCheck, FiX, FiStar, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Results = () => {
  const { scoreId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [score, setScore] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const audio = useAudioManager({
    tracks: {},
    sfx: {
      correct: '/audio/correct.mp3',
      wrong: '/audio/wrong.mp3',
    },
    initialMuted: false,
    volume: 0.6,
  });

  useEffect(() => {
    loadResults();
  }, [scoreId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      // Since we don't have a direct endpoint for getting score by ID,
      // we'll need to get it from the user's scores
      const response = await scoreAPI.getUserScores(user.id, { limit: 100 });
      const foundScore = response.data.scores.find(s => s._id === scoreId);
      
      if (!foundScore) {
        toast.error('Score not found');
        navigate('/dashboard');
        return;
      }

      setScore(foundScore);
      
      // Load quiz details
      const quizResponse = await quizAPI.getQuiz(foundScore.quiz._id);
      setQuiz(quizResponse.data);
      
    } catch (error) {
      console.error('Error loading results:', error);
      toast.error('Failed to load results');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && score) {
      const pct = score.percentage || 0;
      if (pct >= 50) {
        audio.playSfx('correct');
      } else {
        audio.playSfx('wrong');
      }
    }
  }, [loading, score]);

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return { message: 'Outstanding!', color: 'text-green-600' };
    if (percentage >= 80) return { message: 'Excellent!', color: 'text-green-600' };
    if (percentage >= 70) return { message: 'Good job!', color: 'text-blue-600' };
    if (percentage >= 60) return { message: 'Not bad!', color: 'text-yellow-600' };
    return { message: 'Keep practicing!', color: 'text-red-600' };
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

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

  if (!score || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Results not found</h2>
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const performance = getPerformanceMessage(score.percentage);
  const correctAnswers = score.answers.filter(answer => answer.isCorrect).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAward className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quiz Complete!
          </h1>
          <p className={`text-xl font-semibold ${performance.color}`}>
            {performance.message}
          </p>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FiStar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {score.percentage}%
            </h3>
            <p className="text-gray-600">Final Score</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FiCheck className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {correctAnswers}/{quiz.questions.length}
            </h3>
            <p className="text-gray-600">Correct Answers</p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FiClock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {Math.floor(score.timeTaken / 60)}:{(score.timeTaken % 60).toString().padStart(2, '0')}
            </h3>
            <p className="text-gray-600">Time Taken</p>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{quiz.title}</h2>
            <span className={`badge ${getDifficultyBadge(quiz.difficulty)}`}>
              {quiz.difficulty}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{quiz.description}</p>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span>{quiz.category}</span>
            <span>•</span>
            <span>{quiz.questions.length} questions</span>
            <span>•</span>
            <span>{quiz.totalPoints} points</span>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Question Review</h3>
          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = score.answers.find(answer => 
                answer.questionId === question._id
              );
              const isCorrect = userAnswer?.isCorrect || false;
              const selectedAnswer = userAnswer?.selectedAnswer;

              return (
                <div key={question._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      Question {index + 1}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {isCorrect ? (
                        <FiCheck className="w-5 h-5 text-green-600" />
                      ) : (
                        <FiX className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {question.points} point{question.points !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-900 mb-4">{question.question}</p>

                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = selectedAnswer === optionIndex;
                      const isCorrectAnswer = optionIndex === question.correctAnswer;

                      return (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border ${
                            isCorrectAnswer
                              ? 'bg-green-50 border-green-200 text-green-800'
                              : isSelected && !isCorrectAnswer
                              ? 'bg-red-50 border-red-200 text-red-800'
                              : 'bg-gray-50 border-gray-200 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                              isCorrectAnswer
                                ? 'border-green-500 bg-green-500'
                                : isSelected
                                ? 'border-red-500 bg-red-500'
                                : 'border-gray-300'
                            }`}>
                              {isCorrectAnswer && (
                                <FiCheck className="w-3 h-3 text-white" />
                              )}
                              {isSelected && !isCorrectAnswer && (
                                <FiX className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span>{option}</span>
                            {isCorrectAnswer && (
                              <span className="ml-auto text-sm font-medium">
                                Correct Answer
                              </span>
                            )}
                            {isSelected && !isCorrectAnswer && (
                              <span className="ml-auto text-sm font-medium">
                                Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {question.explanation && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/quizzes"
            className="btn btn-primary flex items-center justify-center"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Take Another Quiz
          </Link>
          <Link
            to="/leaderboard"
            className="btn btn-secondary flex items-center justify-center"
          >
            <FiAward className="w-4 h-4 mr-2" />
            View Leaderboard
          </Link>
          <Link
            to="/dashboard"
            className="btn btn-outline flex items-center justify-center"
          >
            <FiArrowRight className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;
