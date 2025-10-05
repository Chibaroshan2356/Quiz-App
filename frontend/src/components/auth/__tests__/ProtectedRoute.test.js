import React from 'react';
import { render, screen } from '../../../utils/testUtils';
import ProtectedRoute from '../ProtectedRoute';

// Mock the useAuth hook
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Test User' },
    loading: false
  })
}));

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated', () => {
    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    jest.doMock('../../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: null,
        loading: true
      })
    }));

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    jest.doMock('../../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: null,
        loading: false
      })
    }));

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
});
