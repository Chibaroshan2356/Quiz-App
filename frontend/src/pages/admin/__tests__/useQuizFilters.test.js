import React from 'react';
import { render, screen, fireEvent } from '../../../utils/testUtils';
import { useQuizFilters } from '../QuizManagement';

// Test component that uses the quiz filters hook
const TestComponent = () => {
  const {
    filters,
    setSearchTerm,
    setCategoryFilter,
    setDifficultyFilter,
    setStatusFilter,
    setSortBy,
    setSortOrder,
    clearFilters
  } = useQuizFilters();

  return (
    <div>
      <div data-testid="search-term">{filters.searchTerm}</div>
      <div data-testid="category-filter">{filters.categoryFilter}</div>
      <div data-testid="difficulty-filter">{filters.difficultyFilter}</div>
      <div data-testid="status-filter">{filters.statusFilter}</div>
      <div data-testid="sort-by">{filters.sortBy}</div>
      <div data-testid="sort-order">{filters.sortOrder}</div>
      <input
        data-testid="search-input"
        value={filters.searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search quizzes..."
      />
      <select
        data-testid="category-select"
        value={filters.categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="Science">Science</option>
        <option value="Math">Math</option>
      </select>
      <select
        data-testid="difficulty-select"
        value={filters.difficultyFilter}
        onChange={(e) => setDifficultyFilter(e.target.value)}
      >
        <option value="all">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
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
        <option value="title">Title</option>
        <option value="category">Category</option>
        <option value="difficulty">Difficulty</option>
        <option value="attempts">Attempts</option>
        <option value="averageScore">Average Score</option>
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

describe('useQuizFilters', () => {
  it('provides default filter values', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('search-term')).toHaveTextContent('');
    expect(screen.getByTestId('category-filter')).toHaveTextContent('all');
    expect(screen.getByTestId('difficulty-filter')).toHaveTextContent('all');
    expect(screen.getByTestId('status-filter')).toHaveTextContent('all');
    expect(screen.getByTestId('sort-by')).toHaveTextContent('title');
    expect(screen.getByTestId('sort-order')).toHaveTextContent('asc');
  });

  it('updates search term when input changes', () => {
    render(<TestComponent />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Science' } });
    
    expect(screen.getByTestId('search-term')).toHaveTextContent('Science');
  });

  it('updates category filter when select changes', () => {
    render(<TestComponent />);
    
    const categorySelect = screen.getByTestId('category-select');
    fireEvent.change(categorySelect, { target: { value: 'Science' } });
    
    expect(screen.getByTestId('category-filter')).toHaveTextContent('Science');
  });

  it('updates difficulty filter when select changes', () => {
    render(<TestComponent />);
    
    const difficultySelect = screen.getByTestId('difficulty-select');
    fireEvent.change(difficultySelect, { target: { value: 'medium' } });
    
    expect(screen.getByTestId('difficulty-filter')).toHaveTextContent('medium');
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
    fireEvent.change(sortSelect, { target: { value: 'category' } });
    
    expect(screen.getByTestId('sort-by')).toHaveTextContent('category');
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
    fireEvent.change(searchInput, { target: { value: 'Science' } });
    
    const categorySelect = screen.getByTestId('category-select');
    fireEvent.change(categorySelect, { target: { value: 'Science' } });
    
    // Clear filters
    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);
    
    expect(screen.getByTestId('search-term')).toHaveTextContent('');
    expect(screen.getByTestId('category-filter')).toHaveTextContent('all');
    expect(screen.getByTestId('difficulty-filter')).toHaveTextContent('all');
    expect(screen.getByTestId('status-filter')).toHaveTextContent('all');
    expect(screen.getByTestId('sort-by')).toHaveTextContent('title');
    expect(screen.getByTestId('sort-order')).toHaveTextContent('asc');
  });
});
