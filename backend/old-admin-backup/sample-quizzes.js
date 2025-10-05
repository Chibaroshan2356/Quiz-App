const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

const sampleQuizzes = [
  {
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    category: "Programming",
    difficulty: "easy",
    timeLimit: 30,
    totalQuestions: 5,
    questions: [
      {
        question: "What is the result of '2' + 2 in JavaScript?",
        options: [
          "4",
          "22",
          "NaN",
          "TypeError"
        ],
        correctAnswer: 1,
        explanation: "In JavaScript, the + operator is used for both addition and string concatenation. When one of the operands is a string, JavaScript converts the other operand to a string and concatenates them.",
        points: 1
      },
      {
        question: "Which of the following is NOT a JavaScript data type?",
        options: [
          "number",
          "string",
          "boolean",
          "character"
        ],
        correctAnswer: 3,
        explanation: "JavaScript has several primitive data types: number, string, boolean, null, undefined, and symbol. 'character' is not a separate data type in JavaScript.",
        points: 1
      },
      {
        question: "What does the 'this' keyword refer to in JavaScript?",
        options: [
          "The function itself",
          "The global object",
          "The object that the function is a method of",
          "It depends on how the function is called"
        ],
        correctAnswer: 3,
        explanation: "The value of 'this' in JavaScript depends on how a function is called. It can refer to different objects based on the context.",
        points: 2
      },
      {
        question: "What is the output of: console.log(1 == '1')",
        options: [
          "true",
          "false",
          "undefined",
          "Error"
        ],
        correctAnswer: 0,
        explanation: "The loose equality operator (==) performs type coercion, so it converts the string '1' to the number 1 before comparison.",
        points: 2
      },
      {
        question: "Which method adds a new element to the end of an array?",
        options: [
          "array.push()",
          "array.pop()",
          "array.shift()",
          "array.unshift()"
        ],
        correctAnswer: 0,
        explanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array.",
        points: 1
      }
    ]
  },
  {
    title: "Python Intermediate Concepts",
    description: "Test your Python programming knowledge",
    category: "Programming",
    difficulty: "medium",
    timeLimit: 45,
    totalQuestions: 5,
    questions: [
      {
        question: "What is the output of: [x**2 for x in range(5) if x % 2 == 0]",
        options: [
          "[0, 1, 4, 9, 16]",
          "[0, 4, 16]",
          "[1, 9]",
          "[0, 2, 4, 16]"
        ],
        correctAnswer: 1,
        explanation: "This list comprehension squares numbers from 0 to 4 but only includes even numbers (0, 2, 4). The squares are 0, 4, and 16.",
        points: 2
      },
      {
        question: "What does the 'yield' keyword do in Python?",
        options: [
          "Returns a value and terminates the function",
          "Pauses the function and returns a generator object",
          "Raises an exception",
          "Imports a module"
        ],
        correctAnswer: 1,
        explanation: "The 'yield' keyword is used in a function to turn it into a generator. When the function is called, it returns a generator object but doesn't start execution immediately.",
        points: 3
      },
      {
        question: "What is the difference between 'is' and '==' in Python?",
        options: [
          "'is' compares values, '==' compares identities",
          "'is' checks if two variables are the same object, '==' checks if they have the same value",
          "They are exactly the same",
          "'is' is used for numbers, '==' for strings"
        ],
        correctAnswer: 1,
        explanation: "'is' checks if two variables refer to the same object in memory, while '==' checks if the values of the objects are equal.",
        points: 3
      },
      {
        question: "What is the output of: list(zip([1, 2], ['a', 'b']))",
        options: [
          "[(1, 'a'), (2, 'b')]",
          "[(1, 2), ('a', 'b')]",
          "[1, 'a', 2, 'b']",
          "[(1, 'a', 2, 'b')]"
        ],
        correctAnswer: 0,
        explanation: "The zip() function returns an iterator of tuples where the i-th tuple contains the i-th element from each of the argument sequences.",
        points: 2
      },
      {
        question: "What is a decorator in Python?",
        options: [
          "A special kind of comment",
          "A function that takes another function and extends its behavior",
          "A way to create classes",
          "A type of loop"
        ],
        correctAnswer: 1,
        explanation: "A decorator is a design pattern in Python that allows a user to add new functionality to an existing object without modifying its structure.",
        points: 3
      }
    ]
  }
];

// Function to insert sample quizzes
async function insertSampleQuizzes() {
  try {
    // Get admin user (you might need to adjust this based on your user model)
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      return;
    }

    // Add createdBy field to each quiz
    const quizzesWithCreator = sampleQuizzes.map(quiz => ({
      ...quiz,
      createdBy: adminUser._id
    }));

    // Insert quizzes
    const result = await Quiz.insertMany(quizzesWithCreator);
    console.log(`Successfully inserted ${result.length} quizzes`);
    return result;
  } catch (error) {
    console.error('Error inserting sample quizzes:', error);
    throw error;
  }
}

// Export the function to be used in other files
module.exports = { insertSampleQuizzes };

// Uncomment the following line to run the script directly
// insertSampleQuizzes().catch(console.error);
