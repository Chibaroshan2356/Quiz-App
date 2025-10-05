import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import Navbar from '../Navbar';

// Mock the useAuth hook
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Test User', email: 'test@example.com' },
    logout: jest.fn()
  })
}));

describe('Navbar', () => {
  it('renders navbar with navigation links', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Quiz App')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
  });

  it('shows user menu when user is authenticated', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('toggles mobile menu when menu button is clicked', () => {
    render(<Navbar />);
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('handles logout when logout button is clicked', () => {
    const mockLogout = jest.fn();
    jest.doMock('../../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: { id: 1, name: 'Test User', email: 'test@example.com' },
        logout: mockLogout
      })
    }));

    render(<Navbar />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });
});
