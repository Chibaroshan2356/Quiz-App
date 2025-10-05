import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useKeyPress } from '../useKeyPress';

// Test component that uses the key press hook
const TestComponent = () => {
  const [escapePressed, setEscapePressed] = React.useState(false);
  const [enterPressed, setEnterPressed] = React.useState(false);

  useKeyPress('Escape', () => setEscapePressed(true));
  useKeyPress('Enter', () => setEnterPressed(true));

  return (
    <div>
      <div data-testid="escape-pressed">{escapePressed.toString()}</div>
      <div data-testid="enter-pressed">{enterPressed.toString()}</div>
    </div>
  );
};

describe('useKeyPress', () => {
  it('calls callback when target key is pressed', () => {
    render(<TestComponent />);
    
    const escapePressed = screen.getByTestId('escape-pressed');
    const enterPressed = screen.getByTestId('enter-pressed');
    
    // Press Escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(escapePressed).toHaveTextContent('true');
    
    // Press Enter key
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(enterPressed).toHaveTextContent('true');
  });

  it('does not call callback when different key is pressed', () => {
    render(<TestComponent />);
    
    const escapePressed = screen.getByTestId('escape-pressed');
    const enterPressed = screen.getByTestId('enter-pressed');
    
    // Press different key
    fireEvent.keyDown(document, { key: 'Space' });
    expect(escapePressed).toHaveTextContent('false');
    expect(enterPressed).toHaveTextContent('false');
  });
});
