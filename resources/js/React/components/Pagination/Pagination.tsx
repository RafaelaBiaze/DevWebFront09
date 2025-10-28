import { PaginationProps } from "./Pagination.types";

export default function Pagination({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    hasNext, 
    hasPrev 
}: PaginationProps) {

    if (totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        if (hasPrev && currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (hasNext && currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    // Gerar array de páginas para mostrar
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);
            
            if (currentPage <= 3) {
                endPage = maxVisiblePages;
            }
            
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - maxVisiblePages + 1;
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav aria-label="Navegação de páginas">
            <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${!hasPrev ? 'disabled' : ''}`}>
                    <button 
                        className="page-link" 
                        onClick={handlePrevious}
                        disabled={!hasPrev}
                        aria-label="Página anterior"
                    >
                        <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
                        <span className="d-none d-sm-inline ms-1">Anterior</span>
                    </button>
                </li>

                {pageNumbers[0] > 1 && (
                    <>
                        <li className="page-item">
                            <button 
                                className="page-link" 
                                onClick={() => handlePageClick(1)}
                            >
                                1
                            </button>
                        </li>
                        {pageNumbers[0] > 2 && (
                            <li className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        )}
                    </>
                )}

                {pageNumbers.map(page => (
                    <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                        <button 
                            className="page-link" 
                            onClick={() => handlePageClick(page)}
                            aria-current={page === currentPage ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages && (
                    <>
                        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                            <li className="page-item disabled">
                                <span className="page-link">...</span>
                            </li>
                        )}
                        <li className="page-item">
                            <button 
                                className="page-link" 
                                onClick={() => handlePageClick(totalPages)}
                            >
                                {totalPages}
                            </button>
                        </li>
                    </>
                )}

                <li className={`page-item ${!hasNext ? 'disabled' : ''}`}>
                    <button 
                        className="page-link" 
                        onClick={handleNext}
                        disabled={!hasNext}
                        aria-label="Próxima página"
                    >
                        <span className="d-none d-sm-inline me-1">Próxima</span>
                        <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
                    </button>
                </li>
            </ul>
        </nav>
    );
}