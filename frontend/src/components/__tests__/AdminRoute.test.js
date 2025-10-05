import React from 'react';
import { render, screen } from '../../utils/testUtils';
import AdminRoute from '../AdminRoute';

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Admin User', role: 'admin' },
    loading: false
  })
}));

describe('AdminRoute', () => {
  it('renders children when user is admin', () => {
    render(
      <AdminRoute>
        <div data-testid="admin-content">Admin Content</div>
      </AdminRoute>
    );
    
    expect(screen.getByTestId('admin-content')).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: null,
        loading: true
      })
    }));

    render(
      <AdminRoute>
        <div data-testid="admin-content">Admin Content</div>
      </AdminRoute>
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows access denied when user is not admin', () => {
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: { id: 1, name: 'Regular User', role: 'user' },
        loading: false
      })
    }));

    render(
      <AdminRoute>
        <div data-testid="admin-content">Admin Content</div>
      </AdminRoute>
    );
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
  });
});
