const express = require('express');
const { body, validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Score = require('../models/Score');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateToken, requireAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalQuizzes,
      totalScores,
      recentScores,
      topQuizzes,
      userStats,
      QuizAttempt
    ] = await Promise.all([
      User.countDocuments(),
      Quiz.countDocuments(),
      Score.countDocuments(),
      Score.find()
        .populate('user', 'name')
        .populate('quiz', 'title')
        .sort({ completedAt: -1 })
        .limit(10),
      Quiz.aggregate([
        { $lookup: { from: 'scores', localField: '_id', foreignField: 'quiz', as: 'scores' } },
        { $addFields: { 
          attemptCount: { $size: '$scores' },
          averageScore: { $avg: '$scores.percentage' }
        }},
        { $sort: { attemptCount: -1 } },
        { $limit: 10 },
        { $project: { title: 1, category: 1, difficulty: 1, attemptCount: 1, averageScore: 1 } }
      ]),
      User.aggregate([
        { $lookup: { from: 'scores', localField: '_id', foreignField: 'user', as: 'scores' } },
        { $addFields: { 
          totalScore: { $sum: '$scores.score' },
          quizCount: { $size: '$scores' }
        }},
        { $sort: { totalScore: -1 } },
        { $limit: 10 },
        { $project: { name: 1, email: 1, totalScore: 1, quizCount: 1 } }
      ]),
      require('../models/QuizAttempt')
    ]);

    const activeUsers = await User.countDocuments({ isActive: true });
    const activeQuizzes = await Quiz.countDocuments({ isActive: true });
    const totalAttempts = await QuizAttempt.countDocuments();
    
    // Calculate average score
    const avgScoreResult = await Score.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$percentage' } } }
    ]);
    const averageScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0;

    // Calculate completion rate
    const completedAttempts = await QuizAttempt.countDocuments({ status: 'completed' });
    const completionRate = totalAttempts > 0 ? Math.round((completedAttempts / totalAttempts) * 100) : 0;

    res.json({
      overview: {
        totalUsers,
        activeUsers,
        totalQuizzes,
        activeQuizzes,
        totalScores,
        totalAttempts,
        averageScore,
        completionRate
      },
      recentActivity: recentScores,
      topQuizzes,
      topUsers: userStats
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const { limit = 20, page = 1, search = '', role = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user (role, status)
// @access  Private (Admin)
router.put('/users/:id', [
  body('role').optional().isIn(['user', 'admin']).withMessage('Role must be user or admin'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from demoting themselves
    if (user._id.toString() === req.user._id.toString() && req.body.role === 'user') {
      return res.status(400).json({ message: 'Cannot demote yourself' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        user[key] = req.body[key];
      }
    });

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error updating user' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin)
router.delete('/users/:id', async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete yourself' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user and all related data
    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      Score.deleteMany({ user: req.params.id })
    ]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

// @route   GET /api/admin/quizzes
// @desc    Get all quizzes (including inactive)
// @access  Private (Admin)
router.get('/quizzes', async (req, res) => {
  try {
    const { limit = 20, page = 1, search = '', category = '', difficulty = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = {};
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    if (category) filter.category = new RegExp(category, 'i');
    if (difficulty) filter.difficulty = difficulty;

    const quizzes = await Quiz.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Quiz.countDocuments(filter);

    res.json({
      quizzes,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get admin quizzes error:', error);
    res.status(500).json({ message: 'Server error fetching quizzes' });
  }
});

// @route   GET /api/admin/scores
// @desc    Get all scores with filtering
// @access  Private (Admin)
router.get('/scores', async (req, res) => {
  try {
    const { 
      limit = 20, 
      page = 1, 
      userId = '', 
      quizId = '', 
      startDate = '', 
      endDate = '' 
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = {};
    if (userId) filter.user = userId;
    if (quizId) filter.quiz = quizId;
    if (startDate || endDate) {
      filter.completedAt = {};
      if (startDate) filter.completedAt.$gte = new Date(startDate);
      if (endDate) filter.completedAt.$lte = new Date(endDate);
    }

    const scores = await Score.find(filter)
      .populate('user', 'name email')
      .populate('quiz', 'title category difficulty')
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Score.countDocuments(filter);

    res.json({
      scores,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get admin scores error:', error);
    res.status(500).json({ message: 'Server error fetching scores' });
  }
});

// @route   DELETE /api/admin/scores/:id
// @desc    Delete score
// @access  Private (Admin)
router.delete('/scores/:id', async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (!score) {
      return res.status(404).json({ message: 'Score not found' });
    }

    await Score.findByIdAndDelete(req.params.id);

    res.json({ message: 'Score deleted successfully' });
  } catch (error) {
    console.error('Delete score error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Score not found' });
    }
    res.status(500).json({ message: 'Server error deleting score' });
  }
});

// @route   POST /api/admin/quizzes
// @desc    Create new quiz
// @access  Private (Admin)
router.post('/quizzes', [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('category').notEmpty().withMessage('Category is required'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('timeLimit').isInt({ min: 30, max: 1800 }).withMessage('Time limit must be between 30 and 1800 seconds'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const quizData = {
      ...req.body,
      createdBy: req.user._id,
      totalQuestions: req.body.questions.length
    };

    const quiz = new Quiz(quizData);
    await quiz.save();

    res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Server error creating quiz' });
  }
});

// @route   PUT /api/admin/quizzes/:id
// @desc    Update quiz
// @access  Private (Admin)
router.put('/quizzes/:id', [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('timeLimit').optional().isInt({ min: 30, max: 1800 }).withMessage('Time limit must be between 30 and 1800 seconds')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Update quiz fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        quiz[key] = req.body[key];
      }
    });

    // Recalculate total questions if questions array is updated
    if (req.body.questions) {
      quiz.totalQuestions = req.body.questions.length;
    }

    await quiz.save();

    res.json({
      message: 'Quiz updated successfully',
      quiz
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(500).json({ message: 'Server error updating quiz' });
  }
});

// @route   DELETE /api/admin/quizzes/:id
// @desc    Delete quiz
// @access  Private (Admin)
router.delete('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Delete quiz and all related data
    await Promise.all([
      Quiz.findByIdAndDelete(req.params.id),
      Score.deleteMany({ quiz: req.params.id })
    ]);

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(500).json({ message: 'Server error deleting quiz' });
  }
});

// @route   GET /api/admin/quizzes/:id
// @desc    Get single quiz with details
// @access  Private (Admin)
router.get('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate({
        path: 'scores',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ quiz });
  } catch (error) {
    console.error('Get quiz error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(500).json({ message: 'Server error fetching quiz' });
  }
});

// @route   POST /api/admin/quizzes/ai-generate
// @desc    Generate a quiz using shared AI-like generator
// @access  Private (Admin)
router.post('/quizzes/ai-generate', [
  body('topic').isString().trim().isLength({ min: 2 }).withMessage('Topic is required'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('numQuestions').optional().isInt({ min: 3, max: 20 }).withMessage('numQuestions must be 3-20')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { generateQuiz } = require('../utils/quizGenerator');
    const { topic, difficulty = 'medium', numQuestions = 10 } = req.body;
    const quiz = generateQuiz({ topic, difficulty, numQuestions });
    return res.json({ quiz });
  } catch (error) {
    console.error('AI generate quiz error:', error);
    return res.status(500).json({ message: 'Server error generating quiz' });
  }
});

module.exports = router;
