import React from 'react';
import { render, screen } from '../utils/testUtils';
import App from '../App';

// Mock the router
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ element }) => <div data-testid="route">{element}</div>
}));

describe('App', () => {
  it('renders app with error boundary and providers', () => {
    render(<App />);
    
    expect(screen.getByTestId('router')).toBeInTheDocument();
    expect(screen.getByTestId('routes')).toBeInTheDocument();
  });

  it('includes toaster for notifications', () => {
    render(<App />);
    
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });
});
