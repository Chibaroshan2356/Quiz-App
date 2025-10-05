const express = require('express');
const { body, validationResult } = require('express-validator');
const Score = require('../models/Score');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/scores
// @desc    Submit quiz score
// @access  Private
router.post('/', authenticateToken, [
  body('quizId').isMongoId().withMessage('Valid quiz ID required'),
  body('answers').isArray({ min: 1 }).withMessage('Answers array required'),
  body('timeTaken').isInt({ min: 0 }).withMessage('Time taken must be non-negative'),
  body('answers.*.questionId').isMongoId().withMessage('Valid question ID required'),
  body('answers.*.selectedAnswer').isInt({ min: 0, max: 3 }).withMessage('Selected answer must be 0-3')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quizId, answers, timeTaken } = req.body;

    // Get quiz with questions
    const quiz = await Quiz.findById(quizId);
    if (!quiz || !quiz.isActive) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let totalScore = 0;
    let correctAnswers = 0;
    const detailedAnswers = [];

    for (const answer of answers) {
      const question = quiz.questions.id(answer.questionId);
      if (!question) {
        return res.status(400).json({ message: 'Invalid question ID' });
      }

      const isCorrect = answer.selectedAnswer === question.correctAnswer;
      const points = isCorrect ? question.points : 0;
      
      totalScore += points;
      if (isCorrect) correctAnswers++;

      detailedAnswers.push({
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        points
      });
    }

    const percentage = Math.round((totalScore / quiz.totalPoints) * 100);

    // Create score record
    const score = new Score({
      user: req.user._id,
      quiz: quizId,
      score: totalScore,
      totalPoints: quiz.totalPoints,
      percentage,
      timeTaken,
      answers: detailedAnswers
    });

    await score.save();

    // Update quiz statistics
    quiz.attempts += 1;
    quiz.averageScore = ((quiz.averageScore * (quiz.attempts - 1)) + percentage) / quiz.attempts;
    await quiz.save();

    // Update user statistics
    const user = await User.findById(req.user._id);
    user.totalScore += totalScore;
    user.quizzesCompleted += 1;
    await user.save();

    res.status(201).json({
      message: 'Score submitted successfully',
      score: {
        id: score._id,
        score: totalScore,
        totalPoints: quiz.totalPoints,
        percentage,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        timeTaken,
        isPassed: score.isPassed,
        completedAt: score.completedAt
      }
    });
  } catch (error) {
    console.error('Submit score error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid data format' });
    }
    res.status(500).json({ message: 'Server error submitting score' });
  }
});

// @route   GET /api/scores/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { quizId, limit = 10, timeframe = 'all' } = req.query;
    
    // Build date filter
    let dateFilter = {};
    if (timeframe !== 'all') {
      const now = new Date();
      switch (timeframe) {
        case 'week':
          dateFilter = { completedAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
          break;
        case 'month':
          dateFilter = { completedAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
          break;
        case 'year':
          dateFilter = { completedAt: { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) } };
          break;
      }
    }

    // Build filter
    const filter = { ...dateFilter };
    if (quizId) filter.quiz = quizId;

    // Get top scores
    const leaderboard = await Score.find(filter)
      .populate('user', 'name avatar')
      .populate('quiz', 'title category difficulty')
      .sort({ percentage: -1, timeTaken: 1 })
      .limit(parseInt(limit));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error fetching leaderboard' });
  }
});

// @route   GET /api/scores/user/:userId
// @desc    Get user's scores
// @access  Private
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    // Users can only view their own scores unless they're admin
    if (req.user._id.toString() !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const scores = await Score.find({ user: req.params.userId })
      .populate('quiz', 'title category difficulty')
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Score.countDocuments({ user: req.params.userId });

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
    console.error('Get user scores error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error fetching user scores' });
  }
});

// @route   GET /api/scores/quiz/:quizId
// @desc    Get scores for a specific quiz
// @access  Public
router.get('/quiz/:quizId', async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const scores = await Score.find({ quiz: req.params.quizId })
      .populate('user', 'name avatar')
      .sort({ percentage: -1, timeTaken: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Score.countDocuments({ quiz: req.params.quizId });

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
    console.error('Get quiz scores error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid quiz ID' });
    }
    res.status(500).json({ message: 'Server error fetching quiz scores' });
  }
});

// @route   GET /api/scores/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's total statistics
    const totalScores = await Score.find({ user: userId });
    const totalQuizzes = await Score.distinct('quiz', { user: userId });
    
    const stats = {
      totalQuizzesTaken: totalScores.length,
      uniqueQuizzes: totalQuizzes.length,
      averageScore: 0,
      bestScore: 0,
      totalTimeSpent: 0,
      quizzesPassed: 0,
      categories: {}
    };

    if (totalScores.length > 0) {
      stats.averageScore = Math.round(
        totalScores.reduce((sum, score) => sum + score.percentage, 0) / totalScores.length
      );
      stats.bestScore = Math.max(...totalScores.map(score => score.percentage));
      stats.totalTimeSpent = totalScores.reduce((sum, score) => sum + score.timeTaken, 0);
      stats.quizzesPassed = totalScores.filter(score => score.isPassed).length;

      // Category breakdown
      for (const score of totalScores) {
        const quiz = await Quiz.findById(score.quiz).select('category');
        if (quiz) {
          if (!stats.categories[quiz.category]) {
            stats.categories[quiz.category] = { count: 0, totalScore: 0 };
          }
          stats.categories[quiz.category].count++;
          stats.categories[quiz.category].totalScore += score.percentage;
        }
      }

      // Calculate average for each category
      Object.keys(stats.categories).forEach(category => {
        stats.categories[category].averageScore = Math.round(
          stats.categories[category].totalScore / stats.categories[category].count
        );
      });
    }

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

module.exports = router;
