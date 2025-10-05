import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../utils/testUtils';
import UserManagement from '../UserManagement';
import { adminAPI } from '../../../services/api';

// Mock the API
jest.mock('../../../services/api', () => ({
  adminAPI: {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

describe('UserManagement', () => {
  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      isActive: true,
      createdAt: '2023-01-01'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'admin',
      isActive: false,
      createdAt: '2023-01-02'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    adminAPI.get.mockResolvedValue({ data: mockUsers });
  });

  it('renders users table with data', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('filters users by search term', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search users...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('handles bulk operations', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Select users
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Select first user
    fireEvent.click(checkboxes[2]); // Select second user

    // Click bulk action button
    const bulkActionButton = screen.getByText('Bulk Actions');
    fireEvent.click(bulkActionButton);

    expect(screen.getByText('Delete Selected')).toBeInTheDocument();
    expect(screen.getByText('Activate Selected')).toBeInTheDocument();
  });

  it('exports user data', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('Export Data')).toBeInTheDocument();
    });

    const exportButton = screen.getByText('Export Data');
    fireEvent.click(exportButton);

    expect(screen.getByText('Export as CSV')).toBeInTheDocument();
    expect(screen.getByText('Export as Excel')).toBeInTheDocument();
  });
});
