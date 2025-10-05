import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useCookie } from '../useCookie';

// Test component that uses the cookie hook
const TestComponent = () => {
  const [value, setValue] = useCookie('test-cookie', 'default-value');

  return (
    <div>
      <div data-testid="value">{value}</div>
      <button onClick={() => setValue('new-value')}>Set Value</button>
      <button onClick={() => setValue('another-value')}>Set Another Value</button>
    </div>
  );
};

describe('useCookie', () => {
  beforeEach(() => {
    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: ''
    });
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

  it('sets cookie when setValue is called', () => {
    render(<TestComponent />);
    
    const setButton = screen.getByText('Set Value');
    fireEvent.click(setButton);
    
    expect(document.cookie).toContain('test-cookie=new-value');
  });

  it('retrieves stored value on component mount', () => {
    document.cookie = 'test-cookie=stored-value';
    
    render(<TestComponent />);
    
    expect(screen.getByTestId('value')).toHaveTextContent('stored-value');
  });
});
