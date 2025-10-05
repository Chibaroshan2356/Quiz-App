import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useFocusTrap } from '../useFocusTrap';

// Test component that uses the focus trap hook
const TestComponent = () => {
  const ref = React.useRef(null);
  const { isActive, activate, deactivate } = useFocusTrap(ref);

  return (
    <div>
      <div data-testid="is-active">{isActive.toString()}</div>
      <button onClick={activate}>Activate</button>
      <button onClick={deactivate}>Deactivate</button>
      <div ref={ref} data-testid="trap-container">
        <button>Button 1</button>
        <button>Button 2</button>
        <button>Button 3</button>
      </div>
    </div>
  );
};

describe('useFocusTrap', () => {
  it('provides focus trap state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('is-active')).toHaveTextContent('false');
  });

  it('activates focus trap when activate is called', () => {
    render(<TestComponent />);
    
    const activateButton = screen.getByText('Activate');
    fireEvent.click(activateButton);
    
    expect(screen.getByTestId('is-active')).toHaveTextContent('true');
  });

  it('deactivates focus trap when deactivate is called', () => {
    render(<TestComponent />);
    
    const activateButton = screen.getByText('Activate');
    const deactivateButton = screen.getByText('Deactivate');
    
    // Activate first
    fireEvent.click(activateButton);
    expect(screen.getByTestId('is-active')).toHaveTextContent('true');
    
    // Deactivate
    fireEvent.click(deactivateButton);
    expect(screen.getByTestId('is-active')).toHaveTextContent('false');
  });
});
