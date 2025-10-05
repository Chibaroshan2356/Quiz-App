import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import { useBackup } from '../backup/useBackup';
import { adminAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  adminAPI: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

// Test component that uses the backup hook
const TestComponent = () => {
  const {
    backups,
    loading,
    error,
    fetchBackups,
    createBackup,
    restoreBackup,
    deleteBackup
  } = useBackup();

  return (
    <div>
      <div data-testid="backup-count">{backups.length}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error || 'No error'}</div>
      <button onClick={fetchBackups}>Fetch Backups</button>
      <button onClick={createBackup}>Create Backup</button>
      <button onClick={() => restoreBackup(1)}>Restore Backup</button>
      <button onClick={() => deleteBackup(1)}>Delete Backup</button>
    </div>
  );
};

describe('useBackup', () => {
  const mockBackups = [
    { id: 1, name: 'Backup 1', createdAt: '2023-01-01T10:00:00Z', size: '10MB' },
    { id: 2, name: 'Backup 2', createdAt: '2023-01-02T10:00:00Z', size: '15MB' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    adminAPI.get.mockResolvedValue({ data: mockBackups });
    adminAPI.post.mockResolvedValue({ data: { id: 3 } });
  });

  it('provides backup state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('backup-count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('No error');
  });

  it('handles fetchBackups action', async () => {
    render(<TestComponent />);
    
    const fetchButton = screen.getByText('Fetch Backups');
    fireEvent.click(fetchButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(screen.getByTestId('backup-count')).toHaveTextContent('2');
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  it('handles createBackup action', async () => {
    render(<TestComponent />);
    
    const createButton = screen.getByText('Create Backup');
    fireEvent.click(createButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.post).toHaveBeenCalledWith('/backups');
    });
  });

  it('handles restoreBackup action', async () => {
    render(<TestComponent />);
    
    const restoreButton = screen.getByText('Restore Backup');
    fireEvent.click(restoreButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.post).toHaveBeenCalledWith('/backups/1/restore');
    });
  });

  it('handles deleteBackup action', async () => {
    render(<TestComponent />);
    
    const deleteButton = screen.getByText('Delete Backup');
    fireEvent.click(deleteButton);
    
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    
    await waitFor(() => {
      expect(adminAPI.delete).toHaveBeenCalledWith('/backups/1');
    });
  });
});
