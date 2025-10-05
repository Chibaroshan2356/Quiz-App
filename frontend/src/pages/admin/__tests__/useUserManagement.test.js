import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useUserManagement } from '../UserManagement';
import { adminAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  adminAPI: {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

// Test component that uses the user management hook
const TestComponent = () => {
  const {
    users,
    loading,
    error,
    fetchUsers,
    updateUser,
    deleteUser,
    bulkDeleteUsers,
    bulkUpdateUsers
  } = useUserManagement();

  return (
    <div>
      <div data-testid="user-count">{users.length}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'No error'}</div>
      <button onClick={fetchUsers}>Fetch Users</button>
      <button onClick={() => updateUser(1, { role: 'admin' })}>Update User</button>
      <button onClick={() => deleteUser(1)}>Delete User</button>
      <button onClick={() => bulkDeleteUsers([1, 2])}>Bulk Delete</button>
      <button onClick={() => bulkUpdateUsers([1, 2], { role: 'admin' })}>Bulk Update</button>
    </div>
  );
};

describe('useUserManagement', () => {
  const mockUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    adminAPI.get.mockResolvedValue({ data: mockUsers });
  });

  it('provides user management state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('user-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('No error');
  });

  it('handles fetchUsers action', async () => {
    render(<TestComponent />);
    
    const fetchButton = screen.getByText('Fetch Users');
    fireEvent.click(fetchButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(screen.getByTestId('user-count')).toHaveTextContent('2');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  it('handles updateUser action', async () => {
    adminAPI.put.mockResolvedValue({ data: {} });
    
    render(<TestComponent />);
    
    const updateButton = screen.getByText('Update User');
    fireEvent.click(updateButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.put).toHaveBeenCalledWith('/users/1', { role: 'admin' });
    });
  });

  it('handles deleteUser action', async () => {
    adminAPI.delete.mockResolvedValue({ data: {} });
    
    render(<TestComponent />);
    
    const deleteButton = screen.getByText('Delete User');
    fireEvent.click(deleteButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.delete).toHaveBeenCalledWith('/users/1');
    });
  });

  it('handles bulkDeleteUsers action', async () => {
    adminAPI.delete.mockResolvedValue({ data: {} });
    
    render(<TestComponent />);
    
    const bulkDeleteButton = screen.getByText('Bulk Delete');
    fireEvent.click(bulkDeleteButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.delete).toHaveBeenCalledWith('/users/bulk', { userIds: [1, 2] });
    });
  });

  it('handles bulkUpdateUsers action', async () => {
    adminAPI.put.mockResolvedValue({ data: {} });
    
    render(<TestComponent />);
    
    const bulkUpdateButton = screen.getByText('Bulk Update');
    fireEvent.click(bulkUpdateButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.put).toHaveBeenCalledWith('/users/bulk', { 
        userIds: [1, 2], 
        updates: { role: 'admin' } 
      });
    });
  });
});
