import React from 'react';

interface Props {
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ currentPage, totalPages, setCurrentPage }) => {
    return (
        <div className={`flex items-center justify-center  `}>
            <button
                className='bg-white rounded-lg p-2 text-gray-700 mx-2'
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            <span className='text-slate-200'>{currentPage} of {totalPages}</span>
            <button
                className='bg-white rounded-lg p-2 text-gray-700 mx-2'
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;