import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiLogOut, FiSettings, FiHome, FiBookOpen, FiAward, FiBarChart2, FiShield, FiMoon, FiSun, FiUsers } from 'react-icons/fi';

const NavbarSimple = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false;
  });

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    const cls = document.documentElement.classList;
    if (next) {
      cls.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      cls.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Ensure theme is applied on mount (and when toggled) even on full reload
  useEffect(() => {
    const cls = document.documentElement.classList;
    if (isDark) cls.add('dark'); else cls.remove('dark');
  }, [isDark]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-40 navbar-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center font-bold text-xl">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-glow">
              <FiBookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="brand-gradient">QuizMaster</span>
          </Link>

          {/* Navigation */}
          {/* Breadcrumbs style nav */}
          <div className="hidden md:flex items-center">
            <Link to="/" className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <FiHome size={18} />
              <span className="ml-1">Home</span>
            </Link>
            <span className="mx-3 text-gray-400">/</span>
            <Link to="/quizzes" className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <FiBookOpen size={18} />
              <span className="ml-1">Quizzes</span>
            </Link>
            <span className="mx-3 text-gray-400">/</span>
            <Link to="/multiplayer" className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <FiUsers size={18} />
              <span className="ml-1">Multiplayer</span>
            </Link>
            <span className="mx-3 text-gray-400">/</span>
            <Link to="/leaderboard" className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
              <FiAward size={18} />
              <span className="ml-1">Leaderboard</span>
            </Link>
          </div>

          {/* Theme + User Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="px-3 py-2 rounded-full btn-glass"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors surface"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:inline">
                    {user?.name?.split(' ')[0] || 'Account'}
                  </span>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 surface rounded-xl border py-2 z-50">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/70 rounded-lg"
                    >
                      <FiBarChart2 size={16} />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/70 rounded-lg"
                    >
                      <FiUser size={16} />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/70 rounded-lg"
                    >
                      <FiSettings size={16} />
                      <span>Settings</span>
                    </Link>
                    {user?.role === 'admin' && (
                      <>
                        <div className="border-t border-gray-200 my-1"></div>
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/70 rounded-lg"
                        >
                          <FiShield size={16} />
                          <span>Admin Panel</span>
                        </Link>
                      </>
                    )}
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50/70 rounded-lg"
                    >
                      <FiLogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn btn-gradient px-4 py-2 rounded-full text-sm font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarSimple;
