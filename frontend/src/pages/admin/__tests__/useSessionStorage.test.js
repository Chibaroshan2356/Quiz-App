import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useSessionStorage } from '../useSessionStorage';

// Test component that uses the session storage hook
const TestComponent = () => {
  const [value, setValue] = useSessionStorage('test-key', 'default-value');

  return (
    <div>
      <div data-testid="value">{value}</div>
      <button onClick={() => setValue('new-value')}>Set Value</button>
      <button onClick={() => setValue('another-value')}>Set Another Value</button>
    </div>
  );
};

describe('useSessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();
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

  it('persists value in sessionStorage', () => {
    render(<TestComponent />);
    
    const setButton = screen.getByText('Set Value');
    fireEvent.click(setButton);
    
    expect(sessionStorage.getItem('test-key')).toBe('"new-value"');
  });

  it('retrieves stored value on component mount', () => {
    sessionStorage.setItem('test-key', '"stored-value"');
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('value')).toHaveTextContent('stored-value');
  });
});
