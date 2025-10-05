import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiLogOut, 
  FiSettings, 
  FiAward, 
  FiHome, 
  FiBookOpen, 
  FiBarChart2,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  position: relative;
  z-index: 50;
`;

const NavContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.primary[600]};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;

const LogoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin-right: 0.75rem;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
`;

const NavMenu = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary[600] : theme.colors.text.secondary};
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
    background-color: ${({ theme }) => theme.colors.primary[50]};
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  @media (min-width: 768px) {
    display: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[100]};
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[700]};
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[100]};
  }
`;

const UserAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem);
  min-width: 14rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 50;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 0;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
  
  &:hover {
    background-color: #f3f4f6;
    color: #1f2937;
  }
  
  &:first-child {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  
  &:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const LoginButton = styled(Link)`
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const SignUpButton = styled(Link)`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  text-decoration: none;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[600]};
    color: white;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClickOutside = (event) => {
      if (userMenuOpen) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Quizzes', path: '/quizzes', icon: FiBookOpen },
    { name: 'Leaderboard', path: '/leaderboard', icon: FiAward },
  ];

  const userMenuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: FiBarChart2 },
    { name: 'Profile', path: '/profile', icon: FiUser },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];

  if (user?.role === 'admin') {
    userMenuItems.push({ name: 'Admin', path: '/admin', icon: FiSettings });
  }

  return (
    <Nav className={scrolled ? 'shadow-md' : ''}>
      <NavContainer>
        <Logo to="/" onClick={() => setIsOpen(false)}>
          <LogoIcon>
            <FiBookOpen size={16} />
          </LogoIcon>
          QuizMaster
        </Logo>

        <NavMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.name} 
                to={item.path}
                $isActive={isActive(item.path)}
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </NavMenu>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <UserMenu data-user-menu>
              <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <UserAvatar>
                  {user?.name?.charAt(0)?.toUpperCase() || <FiUser size={16} />}
                </UserAvatar>
                <span className="hidden md:inline">
                  {user?.name?.split(' ')[0] || 'Account'}
                </span>
                {userMenuOpen ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </UserButton>
              
              {userMenuOpen && (
                <DropdownMenu>
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownItem 
                        key={item.name} 
                        to={item.path}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Icon size={16} />
                        <span>{item.name}</span>
                      </DropdownItem>
                    );
                  })}
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-150 ease-in-out"
                  >
                    <FiLogOut size={16} />
                    <span>Logout</span>
                  </button>
                </DropdownMenu>
              )}
            </UserMenu>
          ) : (
            <AuthButtons>
              <LoginButton to="/login">Log in</LoginButton>
              <SignUpButton to="/register">Sign up</SignUpButton>
            </AuthButtons>
          )}

          <MobileMenuButton onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </MobileMenuButton>
        </div>
      </NavContainer>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                $isActive={isActive(item.path)}
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={18} />
                {item.name}
              </NavLink>
            ))}

            {isAuthenticated && (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                {userMenuItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    $isActive={isActive(item.path)}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </NavLink>
                ))}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <FiLogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Nav>
  );
};

export default Navbar;
