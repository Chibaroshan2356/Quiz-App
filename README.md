# Quizmaster

A comprehensive full-stack quiz application built with React.js frontend and Node.js/Express.js backend, featuring user authentication, dynamic quiz creation, real-time scoring, and admin management.

## 🚀 Features

### Core Features
- **Interactive Quizzes**: Multiple choice questions with timer functionality
- **User Authentication**: Email/password and Google OAuth login
- **Real-time Scoring**: Instant feedback and detailed results
- **Leaderboard**: Global and category-based rankings
- **Progress Tracking**: User statistics and performance analytics
- **Admin Dashboard**: Complete quiz and user management

### Technical Features
- **Frontend**: React.js with functional components and hooks
- **Backend**: Node.js with Express.js and RESTful APIs
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based auth with Google OAuth support
- **UI/UX**: Responsive design with Tailwind CSS
- **State Management**: React Context API
- **Deployment Ready**: Docker, Vercel, and Heroku configurations

## 📁 Project Structure

```
quiz-application/
├── frontend/                 # React.js frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── App.js           # Main app component
│   ├── package.json
│   └── Dockerfile
├── backend/                 # Node.js/Express.js backend
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── server.js            # Main server file
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml       # Docker development setup
├── vercel.json             # Vercel deployment config
└── README.md
```

## 🛠️ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd quiz-application

# Install all dependencies
npm run install-all
```

### 2. Environment Setup

#### Backend Environment
Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/quiz-app
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLIENT_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

#### Frontend Environment
Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
```

### 3. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
# Backend only
npm run server

# Frontend only
npm run client
```

### 4. Seed Sample Data
```bash
# Add sample quizzes to the database
cd backend
npm run seed
```

This will create 18 sample quizzes across different categories:

**Programming (3 quizzes):**
- JavaScript Fundamentals (Easy)
- Python Programming Basics (Medium)
- Web Development Essentials (Hard)

**Geography (3 quizzes):**
- World Geography Challenge (Medium)
- European Capitals & Countries (Easy)
- Natural Wonders & Landmarks (Hard)

**Science (3 quizzes):**
- Science & Nature Quiz (Hard)
- Biology & Life Sciences (Medium)
- Chemistry & Physics Basics (Easy)

**History (3 quizzes):**
- History Trivia (Medium)
- Ancient Civilizations (Hard)
- Modern History & World Wars (Easy)

**Sports (3 quizzes):**
- Sports Knowledge (Easy)
- Football & Soccer (Medium)
- Olympic Games & Records (Hard)

**Entertainment (3 quizzes):**
- Movie & Entertainment (Medium)
- Music & Pop Culture (Easy)
- TV Shows & Streaming (Hard)

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🐳 Docker Development

### Using Docker Compose
```bash
# Start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Docker Commands
```bash
# Build and run backend
cd backend
docker build -t quiz-backend .
docker run -p 5000:5000 --env-file .env quiz-backend

# Build and run frontend
cd frontend
docker build -t quiz-frontend .
docker run -p 3000:80 quiz-frontend
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Heroku)
1. Create a new Heroku app
2. Connect to your GitHub repository
3. Add MongoDB Atlas addon
4. Set environment variables in Heroku dashboard
5. Deploy

### Backend (Render)
1. Create a new Web Service on Render
2. Connect to your GitHub repository
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in your environment variables

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Quiz Endpoints
- `GET /api/quizzes` - Get all quizzes (with filtering)
- `GET /api/quizzes/:id` - Get quiz by ID
- `GET /api/quizzes/random/:category?` - Get random quiz
- `GET /api/quizzes/categories/list` - Get all categories
- `POST /api/quizzes` - Create quiz (admin only)
- `PUT /api/quizzes/:id` - Update quiz (admin only)
- `DELETE /api/quizzes/:id` - Delete quiz (admin only)

### Score Endpoints
- `POST /api/scores` - Submit quiz score
- `GET /api/scores/leaderboard` - Get leaderboard
- `GET /api/scores/user/:userId` - Get user scores
- `GET /api/scores/quiz/:quizId` - Get quiz scores
- `GET /api/scores/stats` - Get user statistics

### Admin Endpoints
- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id` - Update user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `GET /api/admin/quizzes` - Get all quizzes (admin only)
- `GET /api/admin/scores` - Get all scores (admin only)

## 🎯 Usage Guide

### For Users
1. **Register/Login**: Create an account or sign in with Google
2. **Browse Quizzes**: Explore available quizzes by category and difficulty
3. **Take Quizzes**: Answer questions within the time limit
4. **View Results**: See detailed feedback and explanations
5. **Track Progress**: Monitor your performance in the dashboard
6. **Compete**: Check your ranking on the leaderboard

### For Admins
1. **Access Admin Panel**: Navigate to `/admin` (admin role required)
2. **Manage Quizzes**: Create, edit, and delete quizzes
3. **User Management**: View and manage user accounts
4. **Analytics**: Monitor platform usage and performance
5. **Content Moderation**: Review and moderate quiz content

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Configured CORS for secure cross-origin requests
- **Environment Variables**: Sensitive data stored in environment variables

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### E2E Testing
```bash
# Install Playwright
npm install -g @playwright/test

# Run E2E tests
npx playwright test
```

## 📊 Performance Optimizations

- **Code Splitting**: React lazy loading for better performance
- **Image Optimization**: Optimized images and lazy loading
- **Caching**: HTTP caching headers for static assets
- **Database Indexing**: Optimized MongoDB queries with proper indexing
- **Compression**: Gzip compression for API responses

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB is running
   - Verify connection string in `.env`
   - Ensure network access is configured

2. **Google OAuth Not Working**
   - Verify Google Client ID and Secret
   - Check redirect URIs in Google Console
   - Ensure environment variables are set

3. **CORS Errors**
   - Check `CLIENT_URL` in backend `.env`
   - Verify frontend is running on correct port

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify all environment variables are set

## � Local testing against deployed backend (quick)

If Vercel preview protection blocks static files, you can run the frontend locally while pointing API calls to the deployed backend.

1. Build & serve the frontend locally (PowerShell):

```powershell
./run-local-frontend.ps1 -ApiUrl "https://quiz-app-4v2w.onrender.com/api" -Port 3000
```

2. Open http://localhost:3000 in your browser. The frontend will load locally and call the deployed backend at the provided API URL.

3. Useful quick checks (PowerShell):

```powershell
# Manifest (use local site; manifests are local files so this should not 401)
curl.exe -I "http://localhost:3000/manifest.json"

# Health check on deployed backend
curl.exe -i "https://quiz-app-4v2w.onrender.com/api/health"

# Preflight check
curl.exe -i -X OPTIONS "https://quiz-app-4v2w.onrender.com/api/auth/login" `
   -H "Origin: http://localhost:3000" `
   -H "Access-Control-Request-Method: POST" `
   -H "Access-Control-Request-Headers: Content-Type"
```

Notes:
- This approach bypasses Vercel preview protection because you serve the frontend locally. Make sure `FRONTEND_URL` on your backend allows `http://localhost:3000` or our server currently allows localhost.
- For full end-to-end testing (OAuth, cookies), prefer running the backend locally as well and set env variables accordingly.

## �🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React.js community for excellent documentation
- Tailwind CSS for beautiful styling
- MongoDB for robust database solution
- All open-source contributors

## 📞 Support

For support, email support@quizapp.com or create an issue in the GitHub repository.

---

**Happy Quizzing! 🎉**
