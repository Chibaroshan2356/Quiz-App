import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiMoon,
  FiSun,
  FiHome,
  FiBookOpen,
  FiUsers,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiList,
  FiBarChart2
} from 'react-icons/fi';
import logo from '../../assets/logo.svg';


// Main Admin Layout Component
const AdminLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [quizzesDropdownOpen, setQuizzesDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: FiHome },
    { 
      name: 'Quizzes', 
      path: '/admin/quizzes', 
      icon: FiBookOpen,
      hasDropdown: true,
      dropdownItems: [
        { name: 'Manage Quizzes', path: '/admin/quizzes', icon: FiList },
        { name: 'Create Quiz', path: '/admin/quizzes/new', icon: FiPlus }
      ]
    },
    { name: 'Users', path: '/admin/users', icon: FiUsers },
    { name: 'Analytics', path: '/admin/analytics', icon: FiBarChart2 },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg flex flex-col transition-all duration-300`}>
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          ) : (
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto">
              <FiBookOpen className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
          >
            {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isItemActive = isActive(item.path);
              
              if (item.hasDropdown) {
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => setQuizzesDropdownOpen(!quizzesDropdownOpen)}
                      className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-md ${
                        isItemActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-5 h-5 mr-3" />
                        {sidebarOpen && <span>{item.name}</span>}
                      </div>
                      {sidebarOpen && (
                        quizzesDropdownOpen ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {quizzesDropdownOpen && sidebarOpen && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.dropdownItems.map((dropdownItem) => {
                          const DropdownIcon = dropdownItem.icon;
                          const isDropdownItemActive = isActive(dropdownItem.path);
                          return (
                            <li key={dropdownItem.name}>
                              <Link
                                to={dropdownItem.path}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                  isDropdownItemActive
                                    ? 'bg-primary-50 text-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                <DropdownIcon className="w-4 h-4 mr-3" />
                                <span>{dropdownItem.name}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                      isActive(item.path)
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-red-600"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
