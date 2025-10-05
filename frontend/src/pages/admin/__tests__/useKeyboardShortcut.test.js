import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useKeyboardShortcut } from '../useKeyboardShortcut';

// Test component that uses the keyboard shortcut hook
const TestComponent = () => {
  const [count, setCount] = React.useState(0);

  useKeyboardShortcut('ctrl+s', () => {
    setCount(count + 1);
  });

  return (
    <div>
      <div data-testid="count">{count}</div>
    </div>
  );
};

describe('useKeyboardShortcut', () => {
  it('executes callback when shortcut is pressed', () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    
    // Press Ctrl+S
    fireEvent.keyDown(document, { key: 's', ctrlKey: true });
    
    expect(count).toHaveTextContent('1');
  });

  it('does not execute callback when different keys are pressed', () => {
    render(<TestComponent />);
    
    const count = screen.getByTestId('count');
    
    // Press different keys
    fireEvent.keyDown(document, { key: 'a', ctrlKey: true });
    fireEvent.keyDown(document, { key: 's' });
    
    expect(count).toHaveTextContent('0');
  });
});
