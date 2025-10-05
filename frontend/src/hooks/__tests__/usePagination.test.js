import React from 'react';
import { render, screen, fireEvent } from '../../utils/testUtils';
import { usePagination } from '../usePagination';

// Test component that uses the pagination hook
const TestComponent = () => {
  const {
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    setPageSize
  } = usePagination(100, 10);

  return (
    <div>
      <div data-testid="current-page">{currentPage}</div>
      <div data-testid="total-pages">{totalPages}</div>
      <div data-testid="page-size">{pageSize}</div>
      <div data-testid="total-items">{totalItems}</div>
      <div data-testid="start-index">{startIndex}</div>
      <div data-testid="end-index">{endIndex}</div>
      <button onClick={() => goToPage(2)}>Go to Page 2</button>
      <button onClick={nextPage}>Next Page</button>
      <button onClick={prevPage}>Previous Page</button>
      <button onClick={() => setPageSize(20)}>Set Page Size 20</button>
    </div>
  );
};

describe('usePagination', () => {
  it('provides pagination state and functions', () => {
    render(<TestComponent />);
    
    expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    expect(screen.getByTestId('total-pages')).toHaveTextContent('10');
    expect(screen.getByTestId('page-size')).toHaveTextContent('10');
    expect(screen.getByTestId('total-items')).toHaveTextContent('100');
    expect(screen.getByTestId('start-index')).toHaveTextContent('0');
    expect(screen.getByTestId('end-index')).toHaveTextContent('9');
  });

  it('handles goToPage action', () => {
    render(<TestComponent />);
    
    const goToPageButton = screen.getByText('Go to Page 2');
    fireEvent.click(goToPageButton);
    
    expect(screen.getByTestId('current-page')).toHaveTextContent('2');
    expect(screen.getByTestId('start-index')).toHaveTextContent('10');
    expect(screen.getByTestId('end-index')).toHaveTextContent('19');
  });

  it('handles nextPage action', () => {
    render(<TestComponent />);
    
    const nextPageButton = screen.getByText('Next Page');
    fireEvent.click(nextPageButton);
    
    expect(screen.getByTestId('current-page')).toHaveTextContent('2');
  });

  it('handles prevPage action', () => {
    render(<TestComponent />);
    
    // First go to page 2
    const goToPageButton = screen.getByText('Go to Page 2');
    fireEvent.click(goToPageButton);
    
    // Then go back to page 1
    const prevPageButton = screen.getByText('Previous Page');
    fireEvent.click(prevPageButton);
    
    expect(screen.getByTestId('current-page')).toHaveTextContent('1');
  });

  it('handles setPageSize action', () => {
    render(<TestComponent />);
    
    const setPageSizeButton = screen.getByText('Set Page Size 20');
    fireEvent.click(setPageSizeButton);
    
    expect(screen.getByTestId('page-size')).toHaveTextContent('20');
    expect(screen.getByTestId('total-pages')).toHaveTextContent('5');
  });
});
