const express = require('express');
const { body, validationResult } = require('express-validator');
const Quiz = require('../models/Quiz');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/quizzes
// @desc    Get all active quizzes with optional filtering
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, difficulty, limit = 20, page = 1 } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    if (category) filter.category = new RegExp(category, 'i');
    if (difficulty) filter.difficulty = difficulty;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const quizzes = await Quiz.find(filter)
      .select('-questions -questionCount') // Exclude questions and virtual field for list view
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
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error fetching quizzes' });
  }
});

// @route   GET /api/quizzes/:id
// @desc    Get quiz by ID with questions
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!quiz || !quiz.isActive) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Get quiz error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(500).json({ message: 'Server error fetching quiz' });
  }
});

// @route   GET /api/quizzes/categories/list
// @desc    Get all unique categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Quiz.distinct('category', { isActive: true });
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

// @route   GET /api/quizzes/random/:category?
// @desc    Get random quiz by category (optional)
// @access  Public
router.get('/random/:category?', async (req, res) => {
  try {
    const { category } = req.params;
    const { difficulty } = req.query;
    
    const filter = { isActive: true };
    if (category) filter.category = new RegExp(category, 'i');
    if (difficulty) filter.difficulty = difficulty;

    const count = await Quiz.countDocuments(filter);
    if (count === 0) {
      return res.status(404).json({ message: 'No quizzes found' });
    }

    const random = Math.floor(Math.random() * count);
    const quiz = await Quiz.findOne(filter)
      .populate('createdBy', 'name')
      .skip(random);

    res.json(quiz);
  } catch (error) {
    console.error('Get random quiz error:', error);
    res.status(500).json({ message: 'Server error fetching random quiz' });
  }
});

// @route   POST /api/quizzes
// @desc    Create a new quiz (Admin only)
// @access  Private (Admin)
router.post('/', authenticateToken, [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be max 500 characters'),
  body('category').trim().isLength({ min: 2, max: 50 }).withMessage('Category must be 2-50 characters'),
  body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
  body('timeLimit').isInt({ min: 30, max: 1800 }).withMessage('Time limit must be 30-1800 seconds'),
  body('questions').isArray({ min: 1, max: 50 }).withMessage('Must have 1-50 questions'),
  body('questions.*.question').trim().isLength({ min: 10 }).withMessage('Question must be at least 10 characters'),
  body('questions.*.options').isArray({ min: 1, max: 10 }).withMessage('Each question must have 1-10 options'),
  body('questions.*.correctAnswer').isInt({ min: 0 }).withMessage('Correct answer must be a valid index'),
  body('questions.*.points').optional().isInt({ min: 1, max: 10 }).withMessage('Points must be 1-10')
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, difficulty, timeLimit, questions } = req.body;

    // Validate questions array
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      // For multiple choice and true/false questions, validate options
      if (q.type === 'multiple-choice' || q.type === 'true-false') {
        if (q.options.length < 2) {
          return res.status(400).json({ 
            message: `Question ${i + 1} must have at least 2 options` 
          });
        }
        if (q.options.length > 10) {
          return res.status(400).json({ 
            message: `Question ${i + 1} cannot have more than 10 options` 
          });
        }
        if (q.correctAnswer >= q.options.length) {
          return res.status(400).json({ 
            message: `Question ${i + 1} correct answer index is invalid` 
          });
        }
      }
      
      // For fill-blank and short-answer questions, options can be empty or have one placeholder
      if (q.type === 'fill-blank' || q.type === 'short-answer') {
        if (q.options.length > 1) {
          return res.status(400).json({ 
            message: `Question ${i + 1} of type ${q.type} should have at most 1 option` 
          });
        }
      }
    }

    const quiz = new Quiz({
      title,
      description: description || '',
      category,
      difficulty,
      timeLimit,
      questions,
      totalQuestions: questions.length,
      createdBy: req.user._id
    });

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

// @route   PUT /api/quizzes/:id
// @desc    Update quiz (Admin only)
// @access  Private (Admin)
router.put('/:id', authenticateToken, [
  body('title').optional().trim().isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be max 500 characters'),
  body('category').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Category must be 2-50 characters'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Difficulty must be easy, medium, or hard'),
  body('timeLimit').optional().isInt({ min: 30, max: 1800 }).withMessage('Time limit must be 30-1800 seconds'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean')
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        quiz[key] = req.body[key];
      }
    });

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

// @route   DELETE /api/quizzes/:id
// @desc    Delete quiz (Admin only)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await Quiz.findByIdAndDelete(req.params.id);

    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(500).json({ message: 'Server error deleting quiz' });
  }
});

module.exports = router;
