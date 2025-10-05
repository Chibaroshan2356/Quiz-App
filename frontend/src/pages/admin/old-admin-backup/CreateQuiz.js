import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  FiPlus, 
  FiTrash2, 
  FiSave, 
  FiEye, 
  FiUpload,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiImage,
  FiVideo,
  FiFileText,
  FiClock,
  FiUsers,
  FiSettings,
  FiHelpCircle,
  FiZap,
  FiRefreshCw,
  FiEdit3,
  FiCheck,
  FiTarget,
  FiBook,
  FiCpu
} from 'react-icons/fi';
import { quizAPI } from '../../services/api';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showAutoGenerate, setShowAutoGenerate] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [showGeneratedPreview, setShowGeneratedPreview] = useState(false);
  
  // Quiz basic info
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'medium',
    timeLimit: 0,
    passingScore: 70,
    maxAttempts: 0,
    isActive: true,
    allowReview: true,
    showProgress: true,
    shuffleQuestions: false,
    shuffleAnswers: false
  });

  // Questions array
  const [questions, setQuestions] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  // Auto-generation specifications
  const [autoGenSpecs, setAutoGenSpecs] = useState({
    topic: '',
    subject: '',
    difficulty: 'medium',
    questionCount: 10,
    questionTypes: ['multiple-choice', 'true-false'],
    includeImages: false,
    includeExplanations: true,
    timePerQuestion: 2,
    focusAreas: [],
    complexity: 'balanced'
  });

  // Question types configuration
  const questionTypes = [
    { value: 'multiple-choice', label: 'Multiple Choice', icon: FiHelpCircle },
    { value: 'true-false', label: 'True/False', icon: FiHelpCircle },
    { value: 'fill-blank', label: 'Fill in the Blank', icon: FiFileText },
    { value: 'short-answer', label: 'Short Answer', icon: FiFileText }
  ];

  // Handle quiz data changes
  const handleQuizDataChange = (field, value) => {
    setQuizData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add new question
  const addQuestion = useCallback(() => {
    const newQuestion = {
      id: Date.now(),
      type: 'multiple-choice',
      question: '',
      options: ['', ''],
      correctAnswer: 0,
      explanation: '',
      points: 1,
      timeLimit: 0,
      media: null
    };
    
    setQuestions(prev => [...prev, newQuestion]);
    setExpandedQuestion(newQuestion.id);
  }, []);

  // Update question
  const updateQuestion = useCallback((questionId, field, value) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  }, []);

  // Delete question
  const deleteQuestion = useCallback((questionId) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    if (expandedQuestion === questionId) {
      setExpandedQuestion(null);
    }
  }, [expandedQuestion]);

  // Add option to question
  const addOption = useCallback((questionId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        if (q.options.length >= 10) {
          toast.error('Maximum 10 options allowed per question');
          return q;
        }
        return { ...q, options: [...q.options, ''] };
      }
      return q;
    }));
  }, []);

  // Remove option from question
  const removeOption = useCallback((questionId, optionIndex) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        if (q.options.length <= 2) {
          toast.error('Minimum 2 options required per question');
          return q;
        }
        const newOptions = q.options.filter((_, index) => index !== optionIndex);
        const newCorrectAnswer = q.correctAnswer >= optionIndex ? Math.max(0, q.correctAnswer - 1) : q.correctAnswer;
        return { ...q, options: newOptions, correctAnswer: newCorrectAnswer };
      }
      return q;
    }));
  }, []);

  // Update option text
  const updateOption = useCallback((questionId, optionIndex, value) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
          }
        : q
    ));
  }, []);

  // Handle media upload
  const handleMediaUpload = useCallback((questionId, file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const mediaData = {
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: e.target.result,
        name: file.name,
        size: file.size
      };
      
      updateQuestion(questionId, 'media', mediaData);
    };
    reader.readAsDataURL(file);
  }, [updateQuestion]);

  // Remove media
  const removeMedia = useCallback((questionId) => {
    updateQuestion(questionId, 'media', null);
  }, [updateQuestion]);

  // Validate quiz
  const validateQuiz = useCallback(() => {
    if (!quizData.title.trim()) {
      toast.error('Quiz title is required');
      return false;
    }
    
    if (quizData.title.trim().length < 5) {
      toast.error('Quiz title must be at least 5 characters');
      return false;
    }
    
    if (!quizData.category.trim()) {
      toast.error('Quiz category is required');
      return false;
    }
    
    if (quizData.timeLimit < 1) {
      toast.error('Time limit must be at least 1 minute');
      return false;
    }
    
    if (questions.length === 0) {
      toast.error('At least one question is required');
      return false;
    }
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} is required`);
        return false;
      }
      
      if (q.question.trim().length < 10) {
        toast.error(`Question ${i + 1} must be at least 10 characters`);
        return false;
      }
      
      if (q.type === 'multiple-choice' || q.type === 'true-false') {
        if (q.options.length < 2) {
          toast.error(`Question ${i + 1} must have at least 2 options`);
          return false;
        }
        if (q.options.length > 10) {
          toast.error(`Question ${i + 1} cannot have more than 10 options`);
          return false;
        }
        if (q.options.some(opt => !opt.trim())) {
          toast.error(`Question ${i + 1} has empty options`);
          return false;
        }
        if (q.correctAnswer >= q.options.length) {
          toast.error(`Question ${i + 1} correct answer index is invalid`);
          return false;
        }
      }
    }
    
    return true;
  }, [quizData, questions]);

  // Save quiz
  const handleSave = useCallback(async (publish = false) => {
    if (!validateQuiz()) return;
    
    setSaving(true);
    try {
      const quizPayload = {
        title: quizData.title,
        description: quizData.description || '',
        category: quizData.category || 'General',
        difficulty: quizData.difficulty,
        timeLimit: quizData.timeLimit * 60, // Convert minutes to seconds
        questions: questions.map(q => ({
          type: q.type,
          question: q.question,
          options: q.type === 'multiple-choice' || q.type === 'true-false' ? q.options : [''],
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || '',
          points: q.points || 1
        })),
        isActive: publish
      };
      
      console.log('Sending quiz payload:', quizPayload); // Debug log
      await quizAPI.createQuiz(quizPayload);
      toast.success(publish ? 'Quiz published successfully!' : 'Quiz saved as draft!');
      navigate('/admin/quizzes');
    } catch (error) {
      console.error('Save error:', error);
      console.error('Error details:', error.response?.data); // More detailed error logging
      toast.error(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Failed to save quiz');
    } finally {
      setSaving(false);
    }
  }, [quizData, questions, validateQuiz, navigate]);

  // Preview quiz
  const togglePreview = useCallback(() => {
    if (!validateQuiz()) return;
    setPreviewMode(!previewMode);
  }, [previewMode, validateQuiz]);

  // Auto-generation functions
  const handleAutoGenSpecsChange = useCallback((field, value) => {
    setAutoGenSpecs(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const addFocusArea = useCallback((area) => {
    if (area.trim() && !autoGenSpecs.focusAreas.includes(area.trim())) {
      setAutoGenSpecs(prev => ({
        ...prev,
        focusAreas: [...prev.focusAreas, area.trim()]
      }));
    }
  }, [autoGenSpecs.focusAreas]);

  const removeFocusArea = useCallback((area) => {
    setAutoGenSpecs(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.filter(a => a !== area)
    }));
  }, []);

  const toggleQuestionType = useCallback((type) => {
    setAutoGenSpecs(prev => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(type)
        ? prev.questionTypes.filter(t => t !== type)
        : [...prev.questionTypes, type]
    }));
  }, []);

  // Simulate AI question generation
  const generateQuestions = useCallback(async () => {
    if (!autoGenSpecs.topic.trim()) {
      toast.error('Please enter a topic for question generation');
      return;
    }

    setGenerating(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate sample questions based on specifications
      const generated = generateSampleQuestions(autoGenSpecs);
      setGeneratedQuestions(generated);
      setShowGeneratedPreview(true);
      toast.success(`Generated ${generated.length} questions successfully!`);
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate questions. Please try again.');
    } finally {
      setGenerating(false);
    }
  }, [autoGenSpecs]);

  const acceptGeneratedQuestions = useCallback(() => {
    setQuestions(prev => [...prev, ...generatedQuestions]);
    setGeneratedQuestions([]);
    setShowGeneratedPreview(false);
    setShowAutoGenerate(false);
    toast.success('Generated questions added to quiz!');
  }, [generatedQuestions]);

  const rejectGeneratedQuestions = useCallback(() => {
    setGeneratedQuestions([]);
    setShowGeneratedPreview(false);
  }, []);

  const editGeneratedQuestion = useCallback((questionId, updates) => {
    setGeneratedQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
  }, []);

  // Sample question generation (simulate AI)
  const generateSampleQuestions = (specs) => {
    const questions = [];
    const topic = specs.topic.toLowerCase();
    const difficulty = specs.difficulty;
    
    // Sample question templates based on topic
    const templates = {
      'science': [
        {
          type: 'multiple-choice',
          question: `What is the chemical symbol for ${topic.includes('chemistry') ? 'Gold' : 'Oxygen'}?`,
          options: ['Au', 'Ag', 'O', 'H'],
          correctAnswer: topic.includes('chemistry') ? 0 : 2,
          explanation: topic.includes('chemistry') ? 'Gold has the chemical symbol Au from its Latin name "aurum".' : 'Oxygen has the chemical symbol O.'
        },
        {
          type: 'true-false',
          question: `The human heart has four chambers.`,
          options: ['True', 'False'],
          correctAnswer: 0,
          explanation: 'The human heart has four chambers: two atria and two ventricles.'
        }
      ],
      'math': [
        {
          type: 'multiple-choice',
          question: `What is 15% of 200?`,
          options: ['25', '30', '35', '40'],
          correctAnswer: 1,
          explanation: '15% of 200 = 0.15 × 200 = 30'
        },
        {
          type: 'fill-blank',
          question: `The square root of 144 is ___.`,
          options: [],
          correctAnswer: 0,
          explanation: '12 × 12 = 144, so the square root of 144 is 12.'
        }
      ],
      'history': [
        {
          type: 'multiple-choice',
          question: `Who was the first President of the United States?`,
          options: ['George Washington', 'John Adams', 'Thomas Jefferson', 'Benjamin Franklin'],
          correctAnswer: 0,
          explanation: 'George Washington was the first President of the United States, serving from 1789 to 1797.'
        },
        {
          type: 'true-false',
          question: `The Declaration of Independence was signed in 1776.`,
          options: ['True', 'False'],
          correctAnswer: 0,
          explanation: 'The Declaration of Independence was indeed signed on July 4, 1776.'
        }
      ]
    };

    // Get appropriate templates based on subject
    let selectedTemplates = templates['science']; // default
    if (specs.subject) {
      selectedTemplates = templates[specs.subject.toLowerCase()] || templates['science'];
    }

    // Generate questions
    for (let i = 0; i < specs.questionCount; i++) {
      const template = selectedTemplates[i % selectedTemplates.length];
      const question = {
        id: Date.now() + i,
        type: template.type,
        question: template.question,
        options: [...template.options],
        correctAnswer: template.correctAnswer,
        explanation: template.explanation,
        points: 1,
        timeLimit: specs.timePerQuestion,
        media: null
      };
      questions.push(question);
    }

    return questions;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Quiz</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Build engaging quizzes with multiple question types
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAutoGenerate(true)}
                  className="inline-flex items-center px-4 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <FiZap className="h-4 w-4 mr-2" />
                  Auto Generate
                </button>
                <button
                  onClick={togglePreview}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FiEye className="h-4 w-4 mr-2" />
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <FiSave className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <FiSave className="h-4 w-4 mr-2" />
                  {saving ? 'Publishing...' : 'Publish Quiz'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quiz Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quiz Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Title *
                  </label>
                  <input
                    type="text"
                    value={quizData.title}
                    onChange={(e) => handleQuizDataChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter quiz title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={quizData.description}
                    onChange={(e) => handleQuizDataChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter quiz description"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={quizData.category}
                      onChange={(e) => handleQuizDataChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Science, Math, History"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={quizData.difficulty}
                      onChange={(e) => handleQuizDataChange('difficulty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Questions ({questions.length})
                  </h2>
                  <button
                    onClick={addQuestion}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FiPlus className="h-4 w-4 mr-2" />
                    Add Question
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {questions.length === 0 ? (
                  <div className="text-center py-12">
                    <FiHelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                    <p className="text-gray-600 mb-4">Add your first question to get started</p>
                    <button
                      onClick={addQuestion}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <FiPlus className="h-4 w-4 mr-2" />
                      Add Question
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        index={index}
                        isExpanded={expandedQuestion === question.id}
                        onToggle={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                        onUpdate={updateQuestion}
                        onDelete={deleteQuestion}
                        onAddOption={addOption}
                        onRemoveOption={removeOption}
                        onUpdateOption={updateOption}
                        onMediaUpload={handleMediaUpload}
                        onRemoveMedia={removeMedia}
                        questionTypes={questionTypes}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiSettings className="h-5 w-5 mr-2" />
                  Quiz Settings
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (minutes)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={quizData.timeLimit}
                      onChange={(e) => handleQuizDataChange('timeLimit', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0 = No limit"
                      min="0"
                    />
                    <FiClock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    value={quizData.passingScore}
                    onChange={(e) => handleQuizDataChange('passingScore', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Attempts
                  </label>
                  <input
                    type="number"
                    value={quizData.maxAttempts}
                    onChange={(e) => handleQuizDataChange('maxAttempts', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0 = Unlimited"
                    min="0"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={quizData.allowReview}
                      onChange={(e) => handleQuizDataChange('allowReview', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Allow review after completion</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={quizData.showProgress}
                      onChange={(e) => handleQuizDataChange('showProgress', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show progress bar</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={quizData.shuffleQuestions}
                      onChange={(e) => handleQuizDataChange('shuffleQuestions', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Shuffle questions</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={quizData.shuffleAnswers}
                      onChange={(e) => handleQuizDataChange('shuffleAnswers', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Shuffle answer options</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Quiz Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiUsers className="h-5 w-5 mr-2" />
                  Quiz Stats
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Questions:</span>
                  <span className="text-sm font-medium text-gray-900">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Points:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {questions.reduce((sum, q) => sum + (q.points || 1), 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Estimated Time:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {questions.reduce((sum, q) => sum + (q.timeLimit || 0), 0)} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Generation Modal */}
        {showAutoGenerate && (
          <AutoGenerateModal
            specs={autoGenSpecs}
            onSpecsChange={handleAutoGenSpecsChange}
            onAddFocusArea={addFocusArea}
            onRemoveFocusArea={removeFocusArea}
            onToggleQuestionType={toggleQuestionType}
            onGenerate={generateQuestions}
            onClose={() => setShowAutoGenerate(false)}
            generating={generating}
            questionTypes={questionTypes}
          />
        )}

        {/* Generated Questions Preview */}
        {showGeneratedPreview && (
          <GeneratedQuestionsPreview
            questions={generatedQuestions}
            onAccept={acceptGeneratedQuestions}
            onReject={rejectGeneratedQuestions}
            onEdit={editGeneratedQuestion}
            onClose={() => setShowGeneratedPreview(false)}
            questionTypes={questionTypes}
          />
        )}
      </div>
    </div>
  );
};

// Question Card Component
const QuestionCard = ({
  question,
  index,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
  onMediaUpload,
  onRemoveMedia,
  questionTypes
}) => {
  const QuestionTypeIcon = questionTypes.find(t => t.value === question.type)?.icon || FiHelpCircle;

  return (
    <div className="border border-gray-200 rounded-lg">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
            <div className="flex items-center space-x-2">
              <QuestionTypeIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 capitalize">
                {questionTypes.find(t => t.value === question.type)?.label}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {question.points || 1} point{(question.points || 1) !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggle}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
            </button>
            <button
              onClick={() => onDelete(question.id)}
              className="p-1 text-red-400 hover:text-red-600"
            >
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Type
            </label>
            <select
              value={question.type}
              onChange={(e) => onUpdate(question.id, 'type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {questionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question *
            </label>
            <textarea
              value={question.question}
              onChange={(e) => onUpdate(question.id, 'question', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your question"
            />
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media (Optional)
            </label>
            {question.media ? (
              <div className="border border-gray-300 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {question.media.type === 'image' ? (
                      <FiImage className="h-4 w-4 text-gray-400" />
                    ) : (
                      <FiVideo className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-600">{question.media.name}</span>
                  </div>
                  <button
                    onClick={() => onRemoveMedia(question.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
                {question.media.type === 'image' && (
                  <img
                    src={question.media.url}
                    alt="Question media"
                    className="mt-2 max-w-full h-32 object-cover rounded"
                  />
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => onMediaUpload(question.id, e.target.files[0])}
                  className="hidden"
                  id={`media-upload-${question.id}`}
                />
                <label
                  htmlFor={`media-upload-${question.id}`}
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <FiUpload className="h-6 w-6 text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload media</span>
                </label>
              </div>
            )}
          </div>

          {/* Options for Multiple Choice and True/False */}
          {(question.type === 'multiple-choice' || question.type === 'true-false') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Answer Options ({question.options.length}/10)
                </label>
                <button
                  onClick={() => onAddOption(question.id)}
                  disabled={question.options.length >= 10}
                  className={`text-sm ${
                    question.options.length >= 10 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  + Add Option
                </button>
              </div>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={question.correctAnswer === optionIndex}
                      onChange={() => onUpdate(question.id, 'correctAnswer', optionIndex)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => onUpdateOption(question.id, optionIndex, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Option ${optionIndex + 1}`}
                    />
                    {question.options.length > 2 && (
                      <button
                        onClick={() => onRemoveOption(question.id, optionIndex)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    )}
                    {question.options.length === 2 && (
                      <button
                        disabled
                        className="p-1 text-gray-300 cursor-not-allowed"
                        title="Minimum 2 options required"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explanation (Optional)
            </label>
            <textarea
              value={question.explanation}
              onChange={(e) => onUpdate(question.id, 'explanation', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Explain why this is the correct answer"
            />
          </div>

          {/* Question Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points
              </label>
              <input
                type="number"
                value={question.points}
                onChange={(e) => onUpdate(question.id, 'points', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (min)
              </label>
              <input
                type="number"
                value={question.timeLimit}
                onChange={(e) => onUpdate(question.id, 'timeLimit', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                placeholder="0 = No limit"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Auto-Generation Modal Component
const AutoGenerateModal = ({
  specs,
  onSpecsChange,
  onAddFocusArea,
  onRemoveFocusArea,
  onToggleQuestionType,
  onGenerate,
  onClose,
  generating,
  questionTypes
}) => {
  const [focusAreaInput, setFocusAreaInput] = useState('');

  const handleAddFocusArea = () => {
    if (focusAreaInput.trim()) {
      onAddFocusArea(focusAreaInput);
      setFocusAreaInput('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FiCpu className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Auto-Generate Questions</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <FiBook className="h-4 w-4 mr-2" />
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic *
                  </label>
                  <input
                    type="text"
                    value={specs.topic}
                    onChange={(e) => onSpecsChange('topic', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Photosynthesis, World War II, Algebra"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={specs.subject}
                    onChange={(e) => onSpecsChange('subject', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select Subject</option>
                    <option value="science">Science</option>
                    <option value="math">Mathematics</option>
                    <option value="history">History</option>
                    <option value="literature">Literature</option>
                    <option value="geography">Geography</option>
                    <option value="art">Art</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Question Configuration */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <FiTarget className="h-4 w-4 mr-2" />
                Question Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    value={specs.questionCount}
                    onChange={(e) => onSpecsChange('questionCount', parseInt(e.target.value) || 5)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    min="1"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={specs.difficulty}
                    onChange={(e) => onSpecsChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Question Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Question Types
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {questionTypes.map(type => (
                  <label key={type.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={specs.questionTypes.includes(type.value)}
                      onChange={() => onToggleQuestionType(type.value)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Focus Areas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Focus Areas (Optional)
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={focusAreaInput}
                  onChange={(e) => setFocusAreaInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFocusArea()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Add specific focus area"
                />
                <button
                  onClick={handleAddFocusArea}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Add
                </button>
              </div>
              {specs.focusAreas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {specs.focusAreas.map((area, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                    >
                      {area}
                      <button
                        onClick={() => onRemoveFocusArea(area)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Advanced Options */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Advanced Options</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Include explanations</span>
                  <input
                    type="checkbox"
                    checked={specs.includeExplanations}
                    onChange={(e) => onSpecsChange('includeExplanations', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Include images (when possible)</span>
                  <input
                    type="checkbox"
                    checked={specs.includeImages}
                    onChange={(e) => onSpecsChange('includeImages', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time per Question (minutes)
                  </label>
                  <input
                    type="number"
                    value={specs.timePerQuestion}
                    onChange={(e) => onSpecsChange('timePerQuestion', parseInt(e.target.value) || 2)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    min="1"
                    max="10"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                onClick={onGenerate}
                disabled={generating || !specs.topic.trim()}
                className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <FiRefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FiZap className="h-4 w-4 mr-2" />
                    Generate Questions
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Generated Questions Preview Component
const GeneratedQuestionsPreview = ({
  questions,
  onAccept,
  onReject,
  onEdit,
  onClose,
  questionTypes
}) => {
  const [editingQuestion, setEditingQuestion] = useState(null);
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FiCheck className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">
                Generated Questions Preview ({questions.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          {/* Questions List */}
          <div className="space-y-4 mb-6">
            {questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
                      <span className="text-sm text-gray-600 capitalize">
                        {questionTypes.find(t => t.value === question.type)?.label}
                      </span>
                      <span className="text-sm text-gray-500">
                        {question.points} point{question.points !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-gray-900 mb-2">{question.question}</p>
                    {question.options && question.options.length > 0 && (
                      <div className="space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`text-sm ${
                              optIndex === question.correctAnswer
                                ? 'text-green-600 font-medium'
                                : 'text-gray-600'
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                            {optIndex === question.correctAnswer && ' ✓'}
                          </div>
                        ))}
                      </div>
                    )}
                    {question.explanation && (
                      <p className="text-sm text-gray-600 mt-2 italic">
                        Explanation: {question.explanation}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setEditingQuestion(question.id)}
                    className="ml-4 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <FiEdit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onReject}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Reject All
            </button>
            <button
              onClick={onAccept}
              className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <FiCheck className="h-4 w-4 mr-2" />
              Accept All ({questions.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;