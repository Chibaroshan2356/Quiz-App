import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, 
  FiTrash2, 
  FiSave, 
  FiArrowLeft,
  FiClock,
  FiTarget,
  FiBookOpen,
  FiTag
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'medium',
    timeLimit: 600, // 10 minutes in seconds
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    points: 1
  });

  const handleQuizChange = (field, value) => {
    setQuizData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuestionChange = (field, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    if (currentQuestion.type === 'multiple-choice' && !currentQuestion.options[currentQuestion.correctAnswer].trim()) {
      toast.error('Please select a correct answer');
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      id: Date.now() // Temporary ID
    };

    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));

    // Reset current question
    setCurrentQuestion({
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 1
    });

    toast.success('Question added successfully');
  };

  const removeQuestion = (index) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const moveQuestion = (index, direction) => {
    const questions = [...quizData.questions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < questions.length) {
      [questions[index], questions[newIndex]] = [questions[newIndex], questions[index]];
      setQuizData(prev => ({
        ...prev,
        questions
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!quizData.title.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }
    
    if (!quizData.category.trim()) {
      toast.error('Please enter a category');
      return;
    }

    if (quizData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    setLoading(true);

    try {
      await adminAPI.createQuiz(quizData);
      toast.success('Quiz created successfully!');
      navigate('/admin/quizzes');
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error('Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeLimit = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minutes`;
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
        {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/quizzes')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Quiz</h1>
                <p className="text-gray-600">Build a comprehensive quiz with multiple questions</p>
              </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                onClick={() => navigate('/admin/quizzes')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                Cancel
                </button>
                <button
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <FiSave className="h-4 w-4 mr-2" />
                {loading ? 'Creating...' : 'Create Quiz'}
                </button>
          </div>
        </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Quiz Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FiBookOpen className="h-5 w-5 mr-2" />
                Quiz Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    value={quizData.title}
                    onChange={(e) => handleQuizChange('title', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter quiz title..."
                    required
                  />
                </div>
                
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={quizData.category}
                    onChange={(e) => handleQuizChange('category', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Programming, Science, History..."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                    </label>
                    <select
                      value={quizData.difficulty}
                    onChange={(e) => handleQuizChange('difficulty', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
            </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit
                  </label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="60"
                      max="1800"
                      step="30"
                      value={quizData.timeLimit}
                      onChange={(e) => handleQuizChange('timeLimit', parseInt(e.target.value))}
                      className="flex-1 mr-3"
                    />
                    <span className="text-sm text-gray-600 min-w-0">
                      {formatTimeLimit(quizData.timeLimit)}
                    </span>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={quizData.description}
                    onChange={(e) => handleQuizChange('description', e.target.value)}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe what this quiz covers..."
                  />
                </div>
              </div>
            </div>

            {/* Add Question Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FiPlus className="h-5 w-5 mr-2" />
                Add Question
              </h2>
              
              <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type
            </label>
            <select
                    value={currentQuestion.type}
                    onChange={(e) => handleQuestionChange('type', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="fill-blank">Fill in the Blank</option>
                    <option value="short-answer">Short Answer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Text *
            </label>
            <textarea
                    value={currentQuestion.question}
                    onChange={(e) => handleQuestionChange('question', e.target.value)}
              rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your question..."
                    required
            />
          </div>

                {currentQuestion.type === 'multiple-choice' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer Options
            </label>
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3">
                    <input
                      type="radio"
                            name="correctAnswer"
                            checked={currentQuestion.correctAnswer === index}
                            onChange={() => handleQuestionChange('correctAnswer', index)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <input
                      type="text"
                      value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder={`Option ${index + 1}`}
                          />
                  </div>
                ))}
              </div>
            </div>
          )}

                {currentQuestion.type === 'true-false' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answer
            </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
              <input
                          type="radio"
                          name="correctAnswer"
                          checked={currentQuestion.correctAnswer === 0}
                          onChange={() => handleQuestionChange('correctAnswer', 0)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">True</span>
              </label>
                      <label className="flex items-center">
              <input
                          type="radio"
                          name="correctAnswer"
                          checked={currentQuestion.correctAnswer === 1}
                          onChange={() => handleQuestionChange('correctAnswer', 1)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">False</span>
                      </label>
          </div>
        </div>
      )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points
                  </label>
                  <input
                    type="number"
                    min="1"
                      value={currentQuestion.points}
                      onChange={(e) => handleQuestionChange('points', parseInt(e.target.value))}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                      Explanation (Optional)
              </label>
                <input
                  type="text"
                      value={currentQuestion.explanation}
                      onChange={(e) => handleQuestionChange('explanation', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Explain the correct answer..."
                    />
              </div>
            </div>

              <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <FiPlus className="h-4 w-4 mr-2" />
                  Add Question
              </button>
            </div>
          </div>

          {/* Questions List */}
            {quizData.questions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <FiTarget className="h-5 w-5 mr-2" />
                  Quiz Questions ({quizData.questions.length})
                </h2>
                
                <div className="space-y-4">
                  {quizData.questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-3">
                              Q{index + 1}
                      </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {question.points} point{question.points !== 1 ? 's' : ''}
                      </span>
                    </div>
                          <p className="text-sm font-medium text-gray-900 mb-2">
                            {question.question}
                          </p>
                          {question.type === 'multiple-choice' && (
                      <div className="space-y-1">
                        {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center text-sm">
                                  <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center text-xs ${
                              optIndex === question.correctAnswer
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {optIndex === question.correctAnswer ? '✓' : optIndex + 1}
                                  </span>
                                  <span className={optIndex === question.correctAnswer ? 'text-green-700 font-medium' : 'text-gray-600'}>
                                    {option}
                                  </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {question.explanation && (
                            <p className="text-xs text-gray-500 mt-2">
                              <strong>Explanation:</strong> {question.explanation}
                      </p>
                    )}
                  </div>
                        <div className="flex items-center space-x-2 ml-4">
                  <button
                            type="button"
                            onClick={() => moveQuestion(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↑
                  </button>
            <button
                            type="button"
                            onClick={() => moveQuestion(index, 'down')}
                            disabled={index === quizData.questions.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↓
            </button>
            <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="p-1 text-red-400 hover:text-red-600"
            >
                            <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
                  ))}
    </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateQuiz;