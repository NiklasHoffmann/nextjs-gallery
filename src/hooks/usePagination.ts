import { useState, useMemo } from 'react';

interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  paginateData: (data: T[]) => T[];
  startIndex: number;
  endIndex: number;
}

export function usePagination<T = unknown>({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const previousPage = () => goToPage(currentPage - 1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginateData = useMemo(
    () => (data: T[]) => data.slice(startIndex, endIndex),
    [startIndex, endIndex]
  );

  return {
    currentPage,
    totalPages,
    pageSize: itemsPerPage,
    goToPage,
    nextPage,
    previousPage,
    paginateData,
    startIndex,
    endIndex,
  };
}
