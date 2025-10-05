const express = require('express');
const { body, validationResult } = require('express-validator');
const { generateQuiz } = require('../utils/quizGenerator');

const router = express.Router();

// Public AI generation endpoint (no auth) as a fallback
router.post('/generate', [
  body('topic').isString().trim().isLength({ min: 2 }).withMessage('Topic is required'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('numQuestions').optional().isInt({ min: 3, max: 20 }).withMessage('numQuestions must be 3-20')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { topic, difficulty = 'medium', numQuestions = 10 } = req.body;
    const quiz = generateQuiz({ topic, difficulty, numQuestions });
    return res.json({ quiz });
  } catch (error) {
    console.error('Public AI generate error:', error);
    return res.status(500).json({ message: 'Server error generating quiz' });
  }
});

module.exports = router;


