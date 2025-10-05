# QuizMaster Dashboard

A modern, responsive quiz application dashboard built with React, Tailwind CSS, and Framer Motion.

## Features

### 🎨 Modern UI Design
- Clean, minimal interface inspired by Google Classroom/Kahoot
- White background with blue and purple accents
- Rounded cards with soft shadows
- Professional color scheme with clean typography

### 📱 Responsive Layout
- **Top navbar** with QuizMaster branding and user profile
- **Left sidebar navigation** with icons and labels
- **Fully responsive** for both desktop and mobile
- **Mobile-first** approach with collapsible sidebar

### 📊 Dashboard Components
- **4 Metric Cards**: Total Quizzes, Participants, Average Score, Completion Rate
- **Recent Quiz Activity**: Table/list with status indicators
- **Performance Charts**: Participant growth and quiz performance
- **Progress Bars**: Visual metrics with animations

### ⚡ Interactive Features
- **Create Quiz Modal**: Form with title, description, category, difficulty
- **Smooth Animations**: Framer Motion for transitions and hover effects
- **Search Functionality**: Built-in search bar in navbar
- **Notifications**: Bell icon with notification indicator
- **Refresh Button**: Manual data refresh capability

### 🔄 Data Management
- **Real-time data loading** from backend API
- **Loading states** with animated spinners
- **Error handling** with retry functionality
- **Fallback data** when API is unavailable

## Navigation Sidebar

- **Dashboard** (active) - Main dashboard view
- **Create Quiz** - Create new quizzes
- **My Quizzes** - View and manage quizzes
- **Reports** - Analytics and reporting
- **Settings** - Application settings
- **User Profile** - User information at bottom

## Charts & Analytics

- **Participant Growth Chart**: Area chart showing growth over time
- **Quiz Performance Chart**: Bar chart showing scores by topic
- **Progress Bars**: Animated progress indicators
- **Quick Stats**: Gradient card with key metrics

## Animations & Interactions

- **Framer Motion** animations throughout
- **Hover effects** on cards and buttons
- **Smooth transitions** between states
- **Loading animations** for better UX

## Tech Stack

- **React** with modern hooks
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Lucide React** for icons

## Usage

1. **Access the dashboard** at `http://localhost:3000/quizmaster`
2. **Navigate between sections** using the sidebar
3. **Create new quizzes** using the "Create Quiz" button
4. **View analytics** in the charts section
5. **Refresh data** using the refresh button

## API Integration

The dashboard connects to the backend API for:
- Dashboard statistics
- Recent quiz activity
- Chart data
- Quiz creation

If the API is unavailable, the dashboard will show fallback mock data to ensure the UI remains functional.

## Responsive Design

- **Mobile**: Collapsible sidebar, stacked layout
- **Tablet**: Optimized grid layouts
- **Desktop**: Full sidebar with expanded content

## Error Handling

- **Loading states** during data fetching
- **Error messages** with retry options
- **Fallback data** when API fails
- **Graceful degradation** for better UX
