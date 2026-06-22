import React from "react";
import "../styles/Pagination.css";

// Expects the raw PageResponse shape: { pageNumber, totalPages, last }
const Pagination = ({ pageNumber, totalPages, last, onPageChange }) => {
    if (totalPages <= 1) return null;

    const goTo = (page) => {
        if (page < 0 || page >= totalPages) return;
        onPageChange(page);
    };

    // Build a compact window of page numbers around the current page
    const windowSize = 2;
    const start = Math.max(0, pageNumber - windowSize);
    const end = Math.min(totalPages - 1, pageNumber + windowSize);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <nav className="pagination" aria-label="Pagination">
            <button disabled={pageNumber === 0} onClick={() => goTo(pageNumber - 1)}>
                ‹ Prev
            </button>

            {start > 0 && (
                <>
                    <button onClick={() => goTo(0)}>1</button>
                    {start > 1 && <span className="pagination-ellipsis">…</span>}
                </>
            )}

            {pages.map((p) => (
                <button
                    key={p}
                    className={p === pageNumber ? "active" : ""}
                    onClick={() => goTo(p)}
                >
                    {p + 1}
                </button>
            ))}

            {end < totalPages - 1 && (
                <>
                    {end < totalPages - 2 && <span className="pagination-ellipsis">…</span>}
                    <button onClick={() => goTo(totalPages - 1)}>{totalPages}</button>
                </>
            )}

            <button disabled={last} onClick={() => goTo(pageNumber + 1)}>
                Next ›
            </button>
        </nav>
    );
};

export default Pagination;