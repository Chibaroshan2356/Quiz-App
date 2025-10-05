import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useUserFilters } from '../UserManagement';

// Test component that uses the user filters hook
const TestComponent = () => {
  const {
    filters,
    setSearchTerm,
    setRoleFilter,
    setStatusFilter,
    setSortBy,
    setSortOrder,
    clearFilters
  } = useUserFilters();

  return (
    <div>
      <div data-testid="search-term">{filters.searchTerm}</div>
      <div data-testid="role-filter">{filters.roleFilter}</div>
      <div data-testid="status-filter">{filters.statusFilter}</div>
      <div data-testid="sort-by">{filters.sortBy}</div>
      <div data-testid="sort-order">{filters.sortOrder}</div>
      <input
        data-testid="search-input"
        value={filters.searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />
      <select
        data-testid="role-select"
        value={filters.roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        <option value="all">All Roles</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
      <select
        data-testid="status-select"
        value={filters.statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <select
        data-testid="sort-select"
        value={filters.sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="name">Name</option>
        <option value="email">Email</option>
        <option value="createdAt">Created At</option>
      </select>
      <select
        data-testid="order-select"
        value={filters.sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <button onClick={clearFilters}>Clear Filters</button>
    </div>
  );
};

describe('useUserFilters', () => {
  it('provides default filter values', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('search-term')).toHaveTextContent('');
    expect(screen.getByTestId('role-filter')).toHaveTextContent('all');
    expect(screen.getByTestId('status-filter')).toHaveTextContent('all');
    expect(screen.getByTestId('sort-by')).toHaveTextContent('name');
    expect(screen.getByTestId('sort-order')).toHaveTextContent('asc');
  });

  it('updates search term when input changes', () => {
    render(<TestComponent />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    expect(screen.getByTestId('search-term')).toHaveTextContent('John');
  });

  it('updates role filter when select changes', () => {
    render(<TestComponent />);
    
    const roleSelect = screen.getByTestId('role-select');
    fireEvent.change(roleSelect, { target: { value: 'admin' } });
    
    expect(screen.getByTestId('role-filter')).toHaveTextContent('admin');
  });

  it('updates status filter when select changes', () => {
    render(<TestComponent />);
    
    const statusSelect = screen.getByTestId('status-select');
    fireEvent.change(statusSelect, { target: { value: 'active' } });
    
    expect(screen.getByTestId('status-filter')).toHaveTextContent('active');
  });

  it('updates sort by when select changes', () => {
    render(<TestComponent />);
    
    const sortSelect = screen.getByTestId('sort-select');
    fireEvent.change(sortSelect, { target: { value: 'email' } });
    
    expect(screen.getByTestId('sort-by')).toHaveTextContent('email');
  });

  it('updates sort order when select changes', () => {
    render(<TestComponent />);
    
    const orderSelect = screen.getByTestId('order-select');
    fireEvent.change(orderSelect, { target: { value: 'desc' } });
    
    expect(screen.getByTestId('sort-order')).toHaveTextContent('desc');
  });

  it('clears all filters when clear button is clicked', () => {
    render(<TestComponent />);
    
    // Set some filters first
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    const roleSelect = screen.getByTestId('role-select');
    fireEvent.change(roleSelect, { target: { value: 'admin' } });
    
    // Clear filters
    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);
    
    expect(screen.getByTestId('search-term')).toHaveTextContent('');
    expect(screen.getByTestId('role-filter')).toHaveTextContent('all');
    expect(screen.getByTestId('status-filter')).toHaveTextContent('all');
    expect(screen.getByTestId('sort-by')).toHaveTextContent('name');
    expect(screen.getByTestId('sort-order')).toHaveTextContent('asc');
  });
});
