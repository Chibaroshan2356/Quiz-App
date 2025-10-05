import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useLocalStorage } from '../useLocalStorage';

// Test component that uses the local storage hook
const TestComponent = () => {
  const [value, setValue] = useLocalStorage('test-key', 'default-value');

  return (
    <div>
      <div data-testid="value">{value}</div>
      <button onClick={() => setValue('new-value')}>Set Value</button>
      <button onClick={() => setValue('another-value')}>Set Another Value</button>
    </div>
  );
};

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default value when no stored value exists', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('value')).toHaveTextContent('default-value');
  });

  it('updates value when setValue is called', () => {
    render(<TestComponent />);
    
    const setButton = screen.getByText('Set Value');
    fireEvent.click(setButton);
    
    expect(screen.getByTestId('value')).toHaveTextContent('new-value');
  });

  it('persists value in localStorage', () => {
    render(<TestComponent />);
    
    const setButton = screen.getByText('Set Value');
    fireEvent.click(setButton);
    
    expect(localStorage.getItem('test-key')).toBe('"new-value"');
  });

  it('retrieves stored value on component mount', () => {
    localStorage.setItem('test-key', '"stored-value"');
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('value')).toHaveTextContent('stored-value');
  });
});