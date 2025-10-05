const mongoose = require('mongoose');
const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Score = require('./models/Score');

// Sample leaderboard data
const leaderboardEntries = [
  {
    name: 'GOWTHAM M',
    scores: [
      { quizTitle: 'JavaScript Fundamentals', score: 8, totalPoints: 10, timeTaken: 120 },
      { quizTitle: 'Python Intermediate Concepts', score: 11, totalPoints: 13, timeTaken: 180 }
    ]
  },
  {
    name: 'BHARATH M',
    scores: [
      { quizTitle: 'JavaScript Fundamentals', score: 9, totalPoints: 10, timeTaken: 150 },
      { quizTitle: 'Python Intermediate Concepts', score: 10, totalPoints: 13, timeTaken: 200 }
    ]
  },
  {
    name: 'CHARULEELA S',
    scores: [
      { quizTitle: 'JavaScript Fundamentals', score: 7, totalPoints: 10, timeTaken: 140 },
      { quizTitle: 'Python Intermediate Concepts', score: 9, totalPoints: 13, timeTaken: 220 }
    ]
  },
  {
    name: 'NITHYA SREE R',
    scores: [
      { quizTitle: 'JavaScript Fundamentals', score: 10, totalPoints: 10, timeTaken: 110 },
      { quizTitle: 'Python Intermediate Concepts', score: 12, totalPoints: 13, timeTaken: 170 }
    ]
  },
  {
    name: 'MIKASA',
    scores: [
      { quizTitle: 'JavaScript Fundamentals', score: 6, totalPoints: 10, timeTaken: 190 },
      { quizTitle: 'Python Intermediate Concepts', score: 8, totalPoints: 13, timeTaken: 240 }
    ]
  }
];

// Function to add scores to the leaderboard
async function addLeaderboardScores() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quiz-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Get all quizzes for reference
    const quizzes = await Quiz.find({});
    const quizMap = {};
    quizzes.forEach(quiz => {
      quizMap[quiz.title] = quiz._id;
    });

    // Get the first admin user to associate with the scores
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      throw new Error('No admin user found. Please create an admin user first.');
    }

    // Add scores to the leaderboard
    for (const entry of leaderboardEntries) {
      const user = await User.findOne({ name: entry.name }) || adminUser;
      
      console.log(`Adding scores for ${entry.name}`);
      
      // Add each score
      for (const scoreData of entry.scores) {
        const quizId = quizMap[scoreData.quizTitle];
        if (!quizId) {
          console.warn(`Quiz not found: ${scoreData.quizTitle}`);
          continue;
        }

        const score = new Score({
          user: user._id,
          quiz: quizId,
          score: scoreData.score,
          totalPoints: scoreData.totalPoints,
          percentage: Math.round((scoreData.score / scoreData.totalPoints) * 100),
          timeTaken: scoreData.timeTaken,
          answers: []
        });

        await score.save();
        console.log(`  - Added score for ${scoreData.quizTitle}: ${scoreData.score}/${scoreData.totalPoints}`);
      }
    }

    console.log('Successfully added sample users and scores');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting sample users:', error);
    process.exit(1);
  }
}

// Run the function
insertSampleUsers();
