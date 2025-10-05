import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useTheme } from '../useTheme';

// Test component that uses the theme hook
const TestComponent = () => {
  const {
    theme,
    setTheme,
    toggleTheme,
    isDarkMode
  } = useTheme();

  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="is-dark">{isDarkMode.toString()}</div>
      <button onClick={() => setTheme('light')}>Set Light Theme</button>
      <button onClick={() => setTheme('dark')}>Set Dark Theme</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('useTheme', () => {
  it('provides theme state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
  });

  it('sets theme when setTheme is called', () => {
    render(<TestComponent />);
    
    const setDarkButton = screen.getByText('Set Dark Theme');
    fireEvent.click(setDarkButton);
    
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
  });

  it('toggles theme when toggleTheme is called', () => {
    render(<TestComponent />);
    
    const toggleButton = screen.getByText('Toggle Theme');
    fireEvent.click(toggleButton);
    
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('true');
    
    fireEvent.click(toggleButton);
    
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(screen.getByTestId('is-dark')).toHaveTextContent('false');
  });
});
