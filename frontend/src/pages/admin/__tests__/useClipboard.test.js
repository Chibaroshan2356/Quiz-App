import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useClipboard } from '../useClipboard';

// Test component that uses the clipboard hook
const TestComponent = () => {
  const { value, copy, copied } = useClipboard();

  return (
    <div>
      <div data-testid="value">{value || 'No value'}</div>
      <div data-testid="copied">{copied.toString()}</div>
      <button onClick={() => copy('test text')}>Copy Text</button>
    </div>
  );
};

describe('useClipboard', () => {
  beforeEach(() => {
    // Mock navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      value: {
        writeText: jest.fn().mockResolvedValue()
      }
    });
  });

  it('provides clipboard state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('value')).toHaveTextContent('No value');
    expect(screen.getByTestId('copied')).toHaveTextContent('false');
  });

  it('copies text when copy is called', () => {
    render(<TestComponent />);
    
    const copyButton = screen.getByText('Copy Text');
    fireEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
  });
});
