import { render, screen } from '../testUtils';
import React from 'react';

// Test component
const TestComponent = () => <div data-testid="test-component">Test</div>;

describe('testUtils', () => {
  it('renders component with providers', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('provides mock data', () => {
    const { mockData } = require('../testUtils');
    expect(mockData).toBeDefined();
    expect(mockData.users).toBeDefined();
    expect(mockData.quizzes).toBeDefined();
  });

  it('provides mock functions', () => {
    const { mockFunctions } = require('../testUtils');
    expect(mockFunctions).toBeDefined();
    expect(mockFunctions.mockApiCall).toBeDefined();
  });
});
