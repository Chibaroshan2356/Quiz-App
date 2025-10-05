import { useState, useMemo } from 'react';

/**
 * Custom hook for handling pagination logic
 * @param {Object} options - Pagination options
 * @param {number} options.totalItems - Total number of items
 * @param {number} options.itemsPerPage - Number of items per page
 * @param {number} options.initialPage - Initial page number (1-based)
 * @param {number} options.pageRange - Number of page buttons to show
 * @returns {Object} Pagination state and methods
 */
const usePagination = ({
  totalItems = 0,
  itemsPerPage = 10,
  initialPage = 1,
  pageRange = 5,
} = {}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pages = useMemo(() => {
    const halfRange = Math.floor(pageRange / 2);
    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, startPage + pageRange - 1);

    if (endPage - startPage + 1 < pageRange) {
      startPage = Math.max(1, endPage - pageRange + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }, [currentPage, totalPages, pageRange]);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
    return pageNumber;
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    pages,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    startItem: (currentPage - 1) * itemsPerPage + 1,
    endItem: Math.min(currentPage * itemsPerPage, totalItems),
    totalItems,
  };
};

export default usePagination;
