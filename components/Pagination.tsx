"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();
  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `/?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      {/* Previous */}
      {isFirst ? (
        <span className="px-4 py-2 rounded-lg text-sm font-medium text-nordic-dark/30 bg-white border border-nordic-dark/5 cursor-not-allowed select-none">
          ← Prev
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage - 1)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-nordic-dark bg-white border border-nordic-dark/10 hover:border-mosque hover:text-mosque transition-all hover:shadow-md cursor-pointer"
        >
          ← Prev
        </Link>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return isActive ? (
            <span
              key={page}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold bg-nordic-dark text-white shadow-sm"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={createPageURL(page)}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium text-nordic-muted bg-white border border-nordic-dark/5 hover:border-mosque hover:text-mosque transition-all cursor-pointer"
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next */}
      {isLast ? (
        <span className="px-4 py-2 rounded-lg text-sm font-medium text-nordic-dark/30 bg-white border border-nordic-dark/5 cursor-not-allowed select-none">
          Next →
        </span>
      ) : (
        <Link
          href={createPageURL(currentPage + 1)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-nordic-dark bg-white border border-nordic-dark/10 hover:border-mosque hover:text-mosque transition-all hover:shadow-md cursor-pointer"
        >
          Next →
        </Link>
      )}
    </div>
  );
}
