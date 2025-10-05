// Validation utilities for form validation and data validation
import { toast } from 'react-hot-toast';

// Validation rules
export const VALIDATION_RULES = {
  REQUIRED: 'required',
  EMAIL: 'email',
  PASSWORD: 'password',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  NUMERIC: 'numeric',
  URL: 'url',
  PHONE: 'phone',
  DATE: 'date',
  TIME: 'time',
  CUSTOM: 'custom'
};

// Validation error messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PASSWORD: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
  MIN_LENGTH: 'Must be at least {min} characters long',
  MAX_LENGTH: 'Must be no more than {max} characters long',
  NUMERIC: 'Must be a valid number',
  URL: 'Please enter a valid URL',
  PHONE: 'Please enter a valid phone number',
  DATE: 'Please enter a valid date',
  TIME: 'Please enter a valid time',
  CUSTOM: 'Invalid value'
};

// Email validation regex
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

// URL validation regex
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Phone validation regex
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

// Validation functions
export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '' && value.toString().trim() !== '';
};

export const validateEmail = (value) => {
  return EMAIL_REGEX.test(value);
};

export const validatePassword = (value) => {
  return PASSWORD_REGEX.test(value);
};

export const validateMinLength = (value, min) => {
  return value && value.toString().length >= min;
};

export const validateMaxLength = (value, max) => {
  return value && value.toString().length <= max;
};

export const validateNumeric = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

export const validateUrl = (value) => {
  return URL_REGEX.test(value);
};

export const validatePhone = (value) => {
  return PHONE_REGEX.test(value.replace(/[\s\-\(\)]/g, ''));
};

export const validateDate = (value) => {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
};

export const validateTime = (value) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(value);
};

// Main validation function
export const validateField = (value, rules, customMessage = null) => {
  const errors = [];

  for (const rule of rules) {
    let isValid = true;
    let message = customMessage || VALIDATION_MESSAGES[rule.type];

    switch (rule.type) {
      case VALIDATION_RULES.REQUIRED:
        isValid = validateRequired(value);
        break;
      case VALIDATION_RULES.EMAIL:
        isValid = validateEmail(value);
        break;
      case VALIDATION_RULES.PASSWORD:
        isValid = validatePassword(value);
        break;
      case VALIDATION_RULES.MIN_LENGTH:
        isValid = validateMinLength(value, rule.value);
        message = message.replace('{min}', rule.value);
        break;
      case VALIDATION_RULES.MAX_LENGTH:
        isValid = validateMaxLength(value, rule.value);
        message = message.replace('{max}', rule.value);
        break;
      case VALIDATION_RULES.NUMERIC:
        isValid = validateNumeric(value);
        break;
      case VALIDATION_RULES.URL:
        isValid = validateUrl(value);
        break;
      case VALIDATION_RULES.PHONE:
        isValid = validatePhone(value);
        break;
      case VALIDATION_RULES.DATE:
        isValid = validateDate(value);
        break;
      case VALIDATION_RULES.TIME:
        isValid = validateTime(value);
        break;
      case VALIDATION_RULES.CUSTOM:
        isValid = rule.validator ? rule.validator(value) : true;
        message = rule.message || message;
        break;
      default:
        isValid = true;
    }

    if (!isValid) {
      errors.push({
        type: rule.type,
        message: message,
        value: value
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// Form validation
export const validateForm = (formData, validationSchema) => {
  const errors = {};
  let isValid = true;

  for (const [fieldName, rules] of Object.entries(validationSchema)) {
    const value = formData[fieldName];
    const validation = validateField(value, rules);

    if (!validation.isValid) {
      errors[fieldName] = validation.errors;
      isValid = false;
    }
  }

  return {
    isValid,
    errors
  };
};

// Quiz validation
export const validateQuiz = (quizData) => {
  const errors = [];
  let isValid = true;

  // Validate basic quiz info
  if (!quizData.title || quizData.title.trim() === '') {
    errors.push({ field: 'title', message: 'Quiz title is required' });
    isValid = false;
  } else if (quizData.title.length < 3) {
    errors.push({ field: 'title', message: 'Quiz title must be at least 3 characters' });
    isValid = false;
  } else if (quizData.title.length > 100) {
    errors.push({ field: 'title', message: 'Quiz title must be less than 100 characters' });
    isValid = false;
  }

  if (!quizData.category || quizData.category.trim() === '') {
    errors.push({ field: 'category', message: 'Quiz category is required' });
    isValid = false;
  }

  if (quizData.description && quizData.description.length > 500) {
    errors.push({ field: 'description', message: 'Description must be less than 500 characters' });
    isValid = false;
  }

  if (quizData.passingScore < 0 || quizData.passingScore > 100) {
    errors.push({ field: 'passingScore', message: 'Passing score must be between 0 and 100' });
    isValid = false;
  }

  if (quizData.timeLimit < 0) {
    errors.push({ field: 'timeLimit', message: 'Time limit cannot be negative' });
    isValid = false;
  }

  if (quizData.maxAttempts < 0) {
    errors.push({ field: 'maxAttempts', message: 'Max attempts cannot be negative' });
    isValid = false;
  }

  if (quizData.timeBetweenAttempts < 0) {
    errors.push({ field: 'timeBetweenAttempts', message: 'Time between attempts cannot be negative' });
    isValid = false;
  }

  // Validate questions
  if (!quizData.questions || quizData.questions.length === 0) {
    errors.push({ field: 'questions', message: 'At least one question is required' });
    isValid = false;
  } else {
    for (let i = 0; i < quizData.questions.length; i++) {
      const question = quizData.questions[i];
      const questionErrors = validateQuestion(question, i);
      if (questionErrors.length > 0) {
        errors.push(...questionErrors);
        isValid = false;
      }
    }
  }

  return {
    isValid,
    errors
  };
};

// Question validation
export const validateQuestion = (question, questionIndex) => {
  const errors = [];

  if (!question.question || question.question.trim() === '') {
    errors.push({ 
      field: 'question', 
      message: `Question ${questionIndex + 1}: Question text is required`,
      questionIndex 
    });
  } else if (question.question.length < 10) {
    errors.push({ 
      field: 'question', 
      message: `Question ${questionIndex + 1}: Question must be at least 10 characters`,
      questionIndex 
    });
  } else if (question.question.length > 1000) {
    errors.push({ 
      field: 'question', 
      message: `Question ${questionIndex + 1}: Question must be less than 1000 characters`,
      questionIndex 
    });
  }

  if (question.points < 1) {
    errors.push({ 
      field: 'points', 
      message: `Question ${questionIndex + 1}: Points must be at least 1`,
      questionIndex 
    });
  } else if (question.points > 100) {
    errors.push({ 
      field: 'points', 
      message: `Question ${questionIndex + 1}: Points cannot exceed 100`,
      questionIndex 
    });
  }

  if (question.timeLimit < 0) {
    errors.push({ 
      field: 'timeLimit', 
      message: `Question ${questionIndex + 1}: Time limit cannot be negative`,
      questionIndex 
    });
  }

  // Validate based on question type
  switch (question.type) {
    case 'multiple_choice':
    case 'multiple_select':
      if (!question.options || question.options.length < 2) {
        errors.push({ 
          field: 'options', 
          message: `Question ${questionIndex + 1}: At least 2 options are required`,
          questionIndex 
        });
      } else {
        // Check for empty options
        const emptyOptions = question.options.filter(opt => !opt.trim());
        if (emptyOptions.length > 0) {
          errors.push({ 
            field: 'options', 
            message: `Question ${questionIndex + 1}: All options must be filled`,
            questionIndex 
          });
        }

        // Check for duplicate options
        const uniqueOptions = new Set(question.options.map(opt => opt.trim().toLowerCase()));
        if (uniqueOptions.size < question.options.length) {
          errors.push({ 
            field: 'options', 
            message: `Question ${questionIndex + 1}: Duplicate options are not allowed`,
            questionIndex 
          });
        }

        // Check correct answer(s)
        if (question.type === 'multiple_choice') {
          if (question.correctAnswer === null || question.correctAnswer === undefined || 
              question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
            errors.push({ 
              field: 'correctAnswer', 
              message: `Question ${questionIndex + 1}: Please select the correct answer`,
              questionIndex 
            });
          }
        } else if (question.type === 'multiple_select') {
          if (!question.correctAnswers || question.correctAnswers.length === 0) {
            errors.push({ 
              field: 'correctAnswers', 
              message: `Question ${questionIndex + 1}: Please select at least one correct answer`,
              questionIndex 
            });
          } else if (question.correctAnswers.some(ans => ans < 0 || ans >= question.options.length)) {
            errors.push({ 
              field: 'correctAnswers', 
              message: `Question ${questionIndex + 1}: Invalid correct answer selection`,
              questionIndex 
            });
          }
        }
      }
      break;

    case 'true_false':
      if (question.correctAnswer === null || question.correctAnswer === undefined) {
        errors.push({ 
          field: 'correctAnswer', 
          message: `Question ${questionIndex + 1}: Please select true or false`,
          questionIndex 
        });
      }
      break;

    case 'fill_blank':
    case 'short_answer':
    case 'essay':
    case 'numeric':
      if (!question.correctAnswer || (typeof question.correctAnswer === 'string' && !question.correctAnswer.trim())) {
        errors.push({ 
          field: 'correctAnswer', 
          message: `Question ${questionIndex + 1}: Correct answer is required`,
          questionIndex 
        });
      }
      break;

    case 'matching':
      if (!question.options || question.options.length < 2) {
        errors.push({ 
          field: 'options', 
          message: `Question ${questionIndex + 1}: At least 2 matching pairs are required`,
          questionIndex 
        });
      }
      break;

    case 'ordering':
      if (!question.options || question.options.length < 2) {
        errors.push({ 
          field: 'options', 
          message: `Question ${questionIndex + 1}: At least 2 items are required for ordering`,
          questionIndex 
        });
      }
      break;
  }

  // Validate media if present
  if (question.media && question.media.type) {
    if (!question.media.url) {
      errors.push({ 
        field: 'media', 
        message: `Question ${questionIndex + 1}: Media URL is required when media type is selected`,
        questionIndex 
      });
    }

    if (question.media.type === 'image' && !question.media.alt) {
      errors.push({ 
        field: 'media', 
        message: `Question ${questionIndex + 1}: Alt text is required for images`,
        questionIndex 
      });
    }
  }

  // Validate hints
  if (question.hints && question.hints.length > 0) {
    const emptyHints = question.hints.filter(hint => !hint.trim());
    if (emptyHints.length > 0) {
      errors.push({ 
        field: 'hints', 
        message: `Question ${questionIndex + 1}: All hints must be filled`,
        questionIndex 
      });
    }
  }

  return errors;
};

// User validation
export const validateUser = (userData) => {
  const errors = [];
  let isValid = true;

  if (!userData.name || userData.name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
    isValid = false;
  } else if (userData.name.length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
    isValid = false;
  } else if (userData.name.length > 50) {
    errors.push({ field: 'name', message: 'Name must be less than 50 characters' });
    isValid = false;
  }

  if (!userData.email || userData.email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
    isValid = false;
  } else if (!validateEmail(userData.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
    isValid = false;
  }

  if (userData.password && !validatePassword(userData.password)) {
    errors.push({ field: 'password', message: VALIDATION_MESSAGES.PASSWORD });
    isValid = false;
  }

  if (userData.role && !['user', 'admin'].includes(userData.role)) {
    errors.push({ field: 'role', message: 'Role must be either user or admin' });
    isValid = false;
  }

  return {
    isValid,
    errors
  };
};

// Show validation errors
export const showValidationErrors = (errors, options = {}) => {
  const {
    showToast = true,
    toastMessage = null,
    onError = null
  } = options;

  if (errors.length === 0) return;

  // Show first error
  const firstError = errors[0];
  const message = toastMessage || firstError.message;

  if (showToast) {
    toast.error(message);
  }

  if (onError) {
    onError(firstError);
  }
};

// Validation schemas
export const VALIDATION_SCHEMAS = {
  USER: {
    name: [
      { type: VALIDATION_RULES.REQUIRED },
      { type: VALIDATION_RULES.MIN_LENGTH, value: 2 },
      { type: VALIDATION_RULES.MAX_LENGTH, value: 50 }
    ],
    email: [
      { type: VALIDATION_RULES.REQUIRED },
      { type: VALIDATION_RULES.EMAIL }
    ],
    password: [
      { type: VALIDATION_RULES.PASSWORD }
    ],
    role: [
      { type: VALIDATION_RULES.REQUIRED },
      { 
        type: VALIDATION_RULES.CUSTOM, 
        validator: (value) => ['user', 'admin'].includes(value),
        message: 'Role must be either user or admin'
      }
    ]
  },
  QUIZ: {
    title: [
      { type: VALIDATION_RULES.REQUIRED },
      { type: VALIDATION_RULES.MIN_LENGTH, value: 3 },
      { type: VALIDATION_RULES.MAX_LENGTH, value: 100 }
    ],
    category: [
      { type: VALIDATION_RULES.REQUIRED }
    ],
    description: [
      { type: VALIDATION_RULES.MAX_LENGTH, value: 500 }
    ],
    passingScore: [
      { 
        type: VALIDATION_RULES.CUSTOM, 
        validator: (value) => value >= 0 && value <= 100,
        message: 'Passing score must be between 0 and 100'
      }
    ],
    timeLimit: [
      { 
        type: VALIDATION_RULES.CUSTOM, 
        validator: (value) => value >= 0,
        message: 'Time limit cannot be negative'
      }
    ]
  }
};

export default {
  VALIDATION_RULES,
  VALIDATION_MESSAGES,
  validateField,
  validateForm,
  validateQuiz,
  validateQuestion,
  validateUser,
  showValidationErrors,
  VALIDATION_SCHEMAS
};
