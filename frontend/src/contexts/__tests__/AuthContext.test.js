import React from 'react';
import { render, screen, fireEvent } from '../../utils/testUtils';
import { AuthProvider, useAuth } from '../AuthContext';

// Test component that uses the auth context
const TestComponent = () => {
  const { user, token, loading, login, logout, register, updateProfile } = useAuth();

  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <div data-testid="token">{token || 'No token'}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => register('Test User', 'test@example.com', 'password')}>Register</button>
      <button onClick={() => updateProfile({ name: 'Updated User' })}>Update Profile</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('provides auth context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('token')).toHaveTextContent('No token');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('handles login action', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('handles logout action', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('handles register action', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const registerButton = screen.getByText('Register');
    fireEvent.click(registerButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('handles updateProfile action', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const updateButton = screen.getByText('Update Profile');
    fireEvent.click(updateButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });
});
