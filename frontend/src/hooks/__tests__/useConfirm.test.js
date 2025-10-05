import React from 'react';
import { render, screen, fireEvent } from '../../utils/testUtils';
import { useConfirm } from '../useConfirm';

// Test component that uses the confirm hook
const TestComponent = () => {
  const { confirm, ConfirmDialog } = useConfirm();

  const handleDelete = async () => {
    const confirmed = await confirm('Are you sure you want to delete this item?');
    if (confirmed) {
      // Delete logic here
      console.log('Item deleted');
    }
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete Item</button>
      <ConfirmDialog />
    </div>
  );
};

describe('useConfirm', () => {
  it('renders confirm dialog when confirm is called', async () => {
    render(<TestComponent />);
    
    const deleteButton = screen.getByText('Delete Item');
    fireEvent.click(deleteButton);
    
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('handles confirm action', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<TestComponent />);
    
    const deleteButton = screen.getByText('Delete Item');
    fireEvent.click(deleteButton);
    
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Item deleted');
    
    consoleSpy.mockRestore();
  });

  it('handles cancel action', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<TestComponent />);
    
    const deleteButton = screen.getByText('Delete Item');
    fireEvent.click(deleteButton);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(consoleSpy).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
