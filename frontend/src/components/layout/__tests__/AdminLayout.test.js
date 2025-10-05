import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import AdminLayout from '../AdminLayout';

// Mock the useAuth hook
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Admin User', email: 'admin@example.com' },
    logout: jest.fn()
  })
}));

describe('AdminLayout', () => {
  it('renders admin layout with navigation', () => {
    render(
      <AdminLayout>
        <div data-testid="admin-content">Admin Content</div>
      </AdminLayout>
    );
    
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByTestId('admin-content')).toBeInTheDocument();
  });

  it('toggles mobile menu when menu button is clicked', () => {
    render(
      <AdminLayout>
        <div data-testid="admin-content">Admin Content</div>
      </AdminLayout>
    );
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('shows user profile information', () => {
    render(
      <AdminLayout>
        <div data-testid="admin-content">Admin Content</div>
      </AdminLayout>
    );
    
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
  });

  it('handles logout when logout button is clicked', () => {
    const mockLogout = jest.fn();
    jest.doMock('../../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: { name: 'Admin User', email: 'admin@example.com' },
        logout: mockLogout
      })
    }));

    render(
      <AdminLayout>
        <div data-testid="admin-content">Admin Content</div>
      </AdminLayout>
    );
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });
});
