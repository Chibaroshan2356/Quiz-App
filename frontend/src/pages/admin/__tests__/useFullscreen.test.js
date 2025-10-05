import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useFullscreen } from '../useFullscreen';

// Test component that uses the fullscreen hook
const TestComponent = () => {
  const { isFullscreen, enterFullscreen, exitFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <div>
      <div data-testid="is-fullscreen">{isFullscreen.toString()}</div>
      <button onClick={enterFullscreen}>Enter Fullscreen</button>
      <button onClick={exitFullscreen}>Exit Fullscreen</button>
      <button onClick={toggleFullscreen}>Toggle Fullscreen</button>
    </div>
  );
};

describe('useFullscreen', () => {
  beforeEach(() => {
    // Mock document.fullscreenElement
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      value: null
    });

    // Mock document.exitFullscreen
    Object.defineProperty(document, 'exitFullscreen', {
      writable: true,
      value: jest.fn().mockResolvedValue()
    });

    // Mock element.requestFullscreen
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
      writable: true,
      value: jest.fn().mockResolvedValue()
    });
  });

  it('provides fullscreen state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('is-fullscreen')).toHaveTextContent('false');
  });

  it('enters fullscreen when enterFullscreen is called', () => {
    render(<TestComponent />);
    
    const enterButton = screen.getByText('Enter Fullscreen');
    fireEvent.click(enterButton);
    
    expect(HTMLElement.prototype.requestFullscreen).toHaveBeenCalled();
  });

  it('exits fullscreen when exitFullscreen is called', () => {
    render(<TestComponent />);
    
    const exitButton = screen.getByText('Exit Fullscreen');
    fireEvent.click(exitButton);
    
    expect(document.exitFullscreen).toHaveBeenCalled();
  });

  it('toggles fullscreen when toggleFullscreen is called', () => {
    render(<TestComponent />);
    
    const toggleButton = screen.getByText('Toggle Fullscreen');
    fireEvent.click(toggleButton);
    
    expect(HTMLElement.prototype.requestFullscreen).toHaveBeenCalled();
  });
});
