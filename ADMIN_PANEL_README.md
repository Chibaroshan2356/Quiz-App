# Admin Panel Documentation

## Overview

The admin panel is a comprehensive management system for the quiz platform that provides full CRUD operations for all entities, analytics, and system configuration.

## Features

### 🔐 Authentication & Authorization
- **Admin Login**: Dedicated login page at `/admin/login`
- **Role-based Access Control**: Only users with `admin` role can access
- **Session Management**: Secure JWT-based authentication
- **Auto-redirect**: Redirects to admin login if not authenticated

### 📊 Dashboard
- **Real-time Statistics**: Total users, quizzes, attempts, scores
- **Performance Metrics**: Average scores, completion rates
- **Recent Activity**: Latest quiz completions and user registrations
- **Top Performing Quizzes**: Most popular and successful quizzes
- **Quick Actions**: Direct links to common admin tasks

### 👥 User Management
- **View All Users**: Paginated list with search and filtering
- **User Details**: Complete user information and activity
- **Role Management**: Promote/demote users between admin and user roles
- **Account Status**: Activate/deactivate user accounts
- **Delete Users**: Remove users and all associated data

### 📝 Quiz Management
- **Quiz List**: View all quizzes with filtering by category, difficulty, status
- **Create Quiz**: Comprehensive quiz builder with multiple question types
- **Edit Quiz**: Modify existing quizzes and questions
- **Quiz Details**: View detailed quiz information and statistics
- **Delete Quiz**: Remove quizzes and associated data
- **Status Management**: Publish/unpublish and activate/deactivate quizzes

### 📈 Analytics
- **Performance Overview**: Key metrics and trends
- **User Growth**: Visual charts showing user registration trends
- **Quiz Performance**: Top performing quizzes with statistics
- **Category Analysis**: Performance breakdown by quiz categories
- **Export Data**: Download reports and analytics data

### ⚙️ Settings
- **General Settings**: Site name, description, URL configuration
- **Email Settings**: Notification preferences and email templates
- **Security Settings**: Password requirements, session timeouts, login attempts
- **Quiz Settings**: Default time limits, question limits, retake policies
- **Database Settings**: Backup frequency, data retention, cleanup policies

## Getting Started

### 1. Create Admin User

Run the admin user creation script:

```bash
cd backend
node scripts/createAdminUser.js
```

This creates an admin user with:
- **Email**: admin@quiz.com
- **Password**: admin123
- **Role**: admin

### 2. Access Admin Panel

1. Navigate to: `http://localhost:3000/admin/login`
2. Login with the admin credentials
3. You'll be redirected to the admin dashboard

### 3. Admin Panel URLs

- **Dashboard**: `/admin` or `/admin/dashboard`
- **User Management**: `/admin/users`
- **Quiz Management**: `/admin/quizzes`
- **Create Quiz**: `/admin/quizzes/new`
- **Analytics**: `/admin/analytics`
- **Settings**: `/admin/settings`

## API Endpoints

### Admin Authentication
- `POST /api/auth/login` - Login (returns JWT token)
- `GET /api/auth/me` - Get current user info

### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

### User Management
- `GET /api/admin/users` - Get all users (with pagination, search, filters)
- `PUT /api/admin/users/:id` - Update user (role, status)
- `DELETE /api/admin/users/:id` - Delete user

### Quiz Management
- `GET /api/admin/quizzes` - Get all quizzes (with pagination, search, filters)
- `POST /api/admin/quizzes` - Create new quiz
- `GET /api/admin/quizzes/:id` - Get single quiz details
- `PUT /api/admin/quizzes/:id` - Update quiz
- `DELETE /api/admin/quizzes/:id` - Delete quiz

### Score Management
- `GET /api/admin/scores` - Get all scores (with filtering)
- `DELETE /api/admin/scores/:id` - Delete score

## Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  isActive: Boolean,
  lastLogin: Date,
  totalScore: Number,
  quizzesCompleted: Number
}
```

### Quiz Model
```javascript
{
  title: String,
  description: String,
  category: String,
  difficulty: String (enum: ['easy', 'medium', 'hard']),
  questions: [QuestionSchema],
  timeLimit: Number,
  totalQuestions: Number,
  totalPoints: Number,
  isActive: Boolean,
  isPublished: Boolean,
  createdBy: ObjectId (ref: User),
  attempts: Number,
  averageScore: Number
}
```

### Score Model
```javascript
{
  user: ObjectId (ref: User),
  quiz: ObjectId (ref: Quiz),
  score: Number,
  totalPoints: Number,
  percentage: Number,
  timeTaken: Number,
  answers: [AnswerSchema],
  completedAt: Date,
  isPassed: Boolean
}
```

## Security Features

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Session timeout management
- Login attempt limiting

### Authorization
- Role-based access control
- Admin-only routes protection
- User permission validation
- Secure API endpoints

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

## Responsive Design

The admin panel is fully responsive and works on:
- **Desktop**: Full sidebar navigation with expanded layout
- **Tablet**: Collapsible sidebar with touch-friendly interface
- **Mobile**: Mobile-optimized layout with hamburger menu

## Customization

### Themes
- Light theme (default)
- Dark theme support (toggle in AdminLayout)
- Customizable color schemes

### Layout
- Collapsible sidebar
- Responsive grid system
- Flexible component structure

## Error Handling

- **Global Error Boundary**: Catches and displays React errors
- **API Error Handling**: Consistent error responses
- **User Feedback**: Toast notifications for all actions
- **Loading States**: Loading indicators for async operations

## Performance

- **Lazy Loading**: Components loaded on demand
- **Pagination**: Efficient data loading for large datasets
- **Caching**: API response caching where appropriate
- **Optimized Queries**: Database queries optimized for performance

## Development

### File Structure
```
frontend/src/
├── pages/
│   ├── AdminLogin.js
│   └── admin/
│       ├── Dashboard.js
│       ├── UserManagement.js
│       ├── QuizManagement.js
│       ├── CreateQuiz.js
│       ├── Analytics.js
│       └── Settings.js
├── components/
│   └── layout/
│       └── AdminLayout.js
└── services/
    └── api.js
```

### Adding New Features

1. **Create Component**: Add new admin page component
2. **Add Route**: Update App.js with new route
3. **Add Navigation**: Update AdminLayout navigation
4. **Add API**: Create backend endpoints if needed
5. **Add Tests**: Write tests for new functionality

## Troubleshooting

### Common Issues

1. **Cannot Access Admin Panel**
   - Ensure user has `admin` role
   - Check JWT token is valid
   - Verify authentication middleware

2. **API Errors**
   - Check backend server is running
   - Verify database connection
   - Check API endpoint URLs

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check for CSS conflicts
   - Verify responsive breakpoints

### Debug Mode

Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'admin:*');
```

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure database is properly configured
4. Check network requests in browser dev tools

## License

This admin panel is part of the quiz platform project and follows the same licensing terms.
