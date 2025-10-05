import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useNotification } from '../useNotification';

// Test component that uses the notification hook
const TestComponent = () => {
  const {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    markAsRead,
    markAllAsRead
  } = useNotification();

  return (
    <div>
      <div data-testid="notification-count">{notifications.length}</div>
      <div data-testid="unread-count">{notifications.filter(n => !n.read).length}</div>
      <button onClick={() => addNotification('Test notification', 'info')}>Add Notification</button>
      <button onClick={() => removeNotification(0)}>Remove Notification</button>
      <button onClick={clearNotifications}>Clear Notifications</button>
      <button onClick={() => markAsRead(0)}>Mark as Read</button>
      <button onClick={markAllAsRead}>Mark All as Read</button>
    </div>
  );
};

describe('useNotification', () => {
  it('provides notification state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
    expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
  });

  it('adds notification when addNotification is called', () => {
    render(<TestComponent />);
    
    const addButton = screen.getByText('Add Notification');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
    expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
  });

  it('removes notification when removeNotification is called', () => {
    render(<TestComponent />);
    
    // Add a notification first
    const addButton = screen.getByText('Add Notification');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
    
    // Remove the notification
    const removeButton = screen.getByText('Remove Notification');
    fireEvent.click(removeButton);
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
  });

  it('clears all notifications when clearNotifications is called', () => {
    render(<TestComponent />);
    
    // Add some notifications first
    const addButton = screen.getByText('Add Notification');
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('2');
    
    // Clear all notifications
    const clearButton = screen.getByText('Clear Notifications');
    fireEvent.click(clearButton);
    
    expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
  });

  it('marks notification as read when markAsRead is called', () => {
    render(<TestComponent />);
    
    // Add a notification first
    const addButton = screen.getByText('Add Notification');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
    
    // Mark as read
    const markButton = screen.getByText('Mark as Read');
    fireEvent.click(markButton);
    
    expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
  });

  it('marks all notifications as read when markAllAsRead is called', () => {
    render(<TestComponent />);
    
    // Add some notifications first
    const addButton = screen.getByText('Add Notification');
    fireEvent.click(addButton);
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('unread-count')).toHaveTextContent('2');
    
    // Mark all as read
    const markAllButton = screen.getByText('Mark All as Read');
    fireEvent.click(markAllButton);
    
    expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
  });
});
