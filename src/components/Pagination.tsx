import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex items-center space-y-2 text-xs sm:space-y-0 sm:space-x-3 sm:flex">
      <span className="block text-white">
        Page {currentPage} of {totalPages}
      </span>
      <div className="space-x-1">
        <button
          title="previous"
          type="button"
          onClick={onPrevious}
          disabled={currentPage <= 1}
          className="inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          title="next"
          type="button"
          onClick={onNext}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center justify-center w-8 h-8 py-0 border rounded-md shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      
    </div>
  );
};

export default Pagination;
