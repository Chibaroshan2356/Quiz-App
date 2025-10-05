const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalPoints: {
    type: Number,
    required: true,
    min: 1
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  timeTaken: {
    type: Number,
    required: true,
    min: 0 // in seconds
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    points: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  completedAt: {
    type: Date,
    default: Date.now
  },
  isPassed: {
    type: Boolean,
    default: function() {
      return this.percentage >= 60; // 60% passing grade
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
scoreSchema.index({ user: 1, quiz: 1 });
scoreSchema.index({ user: 1, completedAt: -1 });
scoreSchema.index({ quiz: 1, score: -1 });

// Virtual for duration in minutes
scoreSchema.virtual('durationMinutes').get(function() {
  return Math.round(this.timeTaken / 60 * 100) / 100;
});

// Ensure virtual fields are serialized
scoreSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Score', scoreSchema);
