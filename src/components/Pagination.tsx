import React from 'react';

interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className={`flex items-center justify-center ${totalPages <= 1 ? "hidden" : ""}`}>
            <button
                className='bg-white rounded-lg p-2 text-gray-700 mx-2'
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            <span>{currentPage} of {totalPages}</span>
            <button
                className='bg-white rounded-lg p-2 text-gray-700 mx-2'
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;