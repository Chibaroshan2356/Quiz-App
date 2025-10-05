import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { useAuth } from '../contexts/AuthContext';
import { quizAPI, scoreAPI } from '../services/api';
import { FiClock, FiCheck, FiX, FiArrowLeft, FiArrowRight, FiFlag, FiVolumeX, FiVolume2 } from 'react-icons/fi';
import useAudioManager from '../hooks/useAudioManager';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentQuiz,
    currentQuestion,
    answers,
    timeRemaining,
    isQuizActive,
    startQuiz,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    updateTimer,
    submitQuiz,
    resetQuiz,
    getCurrentQuestion,
    getAnsweredQuestions,
    getTotalQuestions,
    isQuestionAnswered,
    getQuestionAnswer,
    isLastQuestion,
    isFirstQuestion,
    getProgress
  } = useQuiz();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const timeUpNotified = useRef(false);
  const audio = useAudioManager({
    tracks: {
      normal: '/audio/calm.mp3',
      urgent: '/audio/urgent.mp3',
    },
    sfx: {
      correct: '/audio/correct.mp3',
      wrong: '/audio/wrong.mp3',
    },
    initialMuted: false,
    volume: 0.5,
    onError: (e) => {
      // eslint-disable-next-line no-console
      console.warn('Audio playback blocked or failed:', e?.message || e);
    }
  });

  useEffect(() => {
    loadQuiz();
    return () => resetQuiz();
  }, [id]);

  // Wall-clock based countdown to avoid drift; at 0, only submit if all answered
  useEffect(() => {
    if (!isQuizActive) return;
    const start = Date.now();
    const initial = timeRemaining;
    let rafId;

    const tick = () => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = Math.max(0, initial - elapsed);
      if (remaining !== timeRemaining) {
        updateTimer(remaining);
      }
      if (remaining === 0) {
        if (!timeUpNotified.current) {
          timeUpNotified.current = true;
          const total = getTotalQuestions();
          // Recompute per-question answered state to avoid any stale counts
          let allAnswered = total > 0;
          for (let i = 0; i < total; i += 1) {
            if (!isQuestionAnswered(i)) {
              allAnswered = false;
              break;
            }
          }
          if (allAnswered) {
            toast("Time's up! Submitting…", { icon: '⏰' });
            // Defer to next tick to ensure any last answer state is flushed
            setTimeout(() => {
              handleSubmitQuiz();
            }, 0);
          } else {
            toast("Time's up! You still have unanswered questions. Not submitted.", { icon: '⚠️' });
          }
        }
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isQuizActive]);

  // Handle background music switching based on urgency (switch at 120s)
  useEffect(() => {
    if (!isQuizActive) return;
    if (timeRemaining > 120) {
      audio.switchBg('normal');
    } else {
      audio.switchBg('urgent');
    }
  }, [isQuizActive, timeRemaining]);

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestion]);

  // Start background music on first user interaction (autoplay policies)
  useEffect(() => {
    if (!isQuizActive) return;
    const handler = () => {
      if (!audio.currentBgKey) {
        audio.playBg('normal');
      }
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
    };
    window.addEventListener('click', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
    };
  }, [isQuizActive]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const response = await quizAPI.getQuiz(id);
      startQuiz(response.data);
      // Reset time-up notification for this quiz instance
      timeUpNotified.current = false;
    } catch (error) {
      console.error('Error loading quiz:', error);
      toast.error('Failed to load quiz');
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (selectedAnswer) => {
    const question = getCurrentQuestion();
    if (!question) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    
    answerQuestion(question._id, selectedAnswer, timeSpent);
    // Do not play correct/wrong SFX during the quiz; only play after submission
    // Background music is managed via first-interaction effect and urgency switcher
  };

  const handleNext = () => {
    if (isLastQuestion()) {
      setShowConfirmSubmit(true);
    } else {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    prevQuestion();
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;

    try {
      setSubmitting(true);
      
      const timeTaken = Math.max(0, (currentQuiz.timeLimit || 0) - timeRemaining);
      
      const preparedAnswers = answers
        .filter((answer) => answer !== undefined)
        .map((answer) => ({
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
        }));

      if (preparedAnswers.length === 0) {
        // Avoid 400 from backend which requires at least one answer
        toast.error('Time expired. No answers to submit.');
        setShowConfirmSubmit(false);
        navigate('/quizzes');
        return;
      }

      const scoreData = {
        quizId: currentQuiz._id,
        answers: preparedAnswers,
        timeTaken,
      };

      const response = await scoreAPI.submitScore(scoreData);
      
      submitQuiz(response.data);
      // Play pass/fail based on percentage if available (>= 50 is pass)
      const pct = response.data?.score?.percentage ?? 0;
      if (pct >= 50) {
        audio.playSfx('correct');
      } else {
        audio.playSfx('wrong');
      }
      navigate(`/results/${response.data.score.id}`);
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      const apiMessage = error?.response?.data?.message;
      if (apiMessage) {
        toast.error(apiMessage);
      } else {
        toast.error('Failed to submit quiz');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const submitWithValidation = () => {
    const total = getTotalQuestions();
    const answered = getAnsweredQuestions();
    if (answered < total) {
      // Find first unanswered and focus user there
      const firstUnansweredIdx = Array.from({ length: total }).findIndex((_, i) => !isQuestionAnswered(i));
      if (firstUnansweredIdx >= 0) {
        goToQuestion(firstUnansweredIdx);
      }
      toast("Please answer all questions before submitting.", {
        icon: '⚠️',
      });
      setShowConfirmSubmit(false);
      return;
    }
    handleSubmitQuiz();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeRemaining <= 60) return 'timer-danger';
    if (timeRemaining <= 300) return 'timer-warning';
    return 'timer-normal';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz not found</h2>
          <button
            onClick={() => navigate('/quizzes')}
            className="btn btn-primary"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const question = getCurrentQuestion();
  if (!question) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="surface border-b border-gray-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/quizzes')}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentQuiz.title}
                </h1>
                <p className="text-sm text-gray-500">
                  {currentQuiz.category} • {currentQuiz.difficulty}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (!audio.currentBgKey) {
                    audio.playBg('normal');
                  }
                  audio.toggleMute();
                }}
                className="text-gray-500 hover:text-gray-700"
                aria-label={audio.muted ? 'Unmute' : 'Mute'}
              >
                {audio.muted ? <FiVolumeX className="w-5 h-5" /> : <FiVolume2 className="w-5 h-5" />}
              </button>
              <div className={`timer ${getTimerClass()} surface`}> 
                <FiClock className="w-4 h-4 mr-1" />
                {formatTime(timeRemaining)}
              </div>
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="btn btn-gradient flex items-center"
              >
                <FiFlag className="w-4 h-4 mr-1" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Questions</h3>
              <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
                {currentQuiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      index === currentQuestion
                        ? 'bg-primary-600 text-white'
                        : isQuestionAnswered(index)
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{getAnsweredQuestions()}/{getTotalQuestions()}</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${getProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className="question-card surface">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">
                    Question {currentQuestion + 1} of {getTotalQuestions()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {question.points} point{question.points !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {question.question}
                </h2>
              </div>

              <div className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = getQuestionAnswer(currentQuestion)?.selectedAnswer === index;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`option-button surface ${
                        isSelected ? 'option-selected' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                          isSelected
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <FiCheck className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="text-left">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={isFirstQuestion()}
                  className="btn btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiArrowLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  className="btn btn-primary flex items-center"
                >
                  {isLastQuestion() ? 'Review' : 'Next'}
                  <FiArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Submit Quiz?
            </h3>
            <p className="text-gray-600 mb-6">
              You have answered {getAnsweredQuestions()} out of {getTotalQuestions()} questions. 
              Are you sure you want to submit your quiz?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={submitWithValidation}
                disabled={submitting}
                className="btn btn-primary flex-1 flex items-center justify-center"
              >
                {submitting ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : null}
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
