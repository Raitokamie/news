import { useState, useEffect, useMemo } from 'react';

export interface UsePaginationOptions {
  totalItems: number;
  initialRowsPerPage?: number;
}

export interface UsePaginationReturn {
  // State
  currentPage: number; // 0-based
  rowsPerPage: number;
  totalPages: number;

  // Actions
  setPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  // Computed
  startIndex: number;
  endIndex: number;
  pageNumbers: (number | 'ellipsis')[]; // Smart pagination array

  // Helpers
  canGoNext: boolean;
  canGoPrev: boolean;
}

// Generate smart pagination array (e.g., [1, '...', 5, 6, 7, '...', 100])
// Note: Returns 1-based page numbers for display, even though internal state is 0-based
function getPageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    // Show all pages if 7 or fewer
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const displayPage = currentPage + 1; // Convert to 1-based for logic

  // Always show first page
  pages.push(1);

  if (displayPage <= 3) {
    // Near start: 1 2 3 4 ... last
    pages.push(2, 3, 4, 'ellipsis', totalPages);
  } else if (displayPage >= totalPages - 2) {
    // Near end: 1 ... last-3 last-2 last-1 last
    pages.push('ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    // Middle: 1 ... current-1 current current+1 ... last
    pages.push('ellipsis', displayPage - 1, displayPage, displayPage + 1, 'ellipsis', totalPages);
  }

  return pages;
}

export function usePagination({
  totalItems,
  initialRowsPerPage = 10
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [rowsPerPage, setRowsPerPageState] = useState(initialRowsPerPage);

  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  // Compute valid page without using effect - avoid cascading renders
  const validPage = Math.min(currentPage, Math.max(0, totalPages - 1));

  const startIndex = validPage * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);

  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const setPage = (page: number) => {
    const newPage = Math.max(0, Math.min(page, totalPages - 1));
    setCurrentPage(newPage);
  };

  const setRowsPerPage = (rows: number) => {
    setRowsPerPageState(rows);
    setCurrentPage(0); // Reset to first page
  };

  const nextPage = () => {
    if (validPage < totalPages - 1) {
      setCurrentPage(validPage + 1);
    }
  };

  const prevPage = () => {
    if (validPage > 0) {
      setCurrentPage(validPage - 1);
    }
  };

  return {
    currentPage: validPage,
    rowsPerPage,
    totalPages,
    setPage,
    setRowsPerPage,
    nextPage,
    prevPage,
    startIndex,
    endIndex,
    pageNumbers,
    canGoNext: validPage < totalPages - 1,
    canGoPrev: validPage > 0,
  };
}
