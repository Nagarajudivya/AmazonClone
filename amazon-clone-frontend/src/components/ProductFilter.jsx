import React from "react";
import "../styles/ProductFilter.css";

// sortBy/sortDir map directly onto GET /products query params; the backend
// (ProductServiceImpl.getAllProducts) calls Sort.by(sortBy) directly on the
// Product entity, so sortBy must be a real entity field name.
const SORT_OPTIONS = [
    { value: "createdAt", label: "Newest" },
    { value: "price", label: "Price" },
    { value: "name", label: "Name" },
    { value: "rating", label: "Rating" },
];

const ProductFilter = ({ sortBy, sortDir, size, onChange }) => {
    return (
        <div className="product-filter">
            <label>
                Sort by
                <select
                    value={sortBy}
                    onChange={(e) => onChange({ sortBy: e.target.value })}
                >
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Order
                <select
                    value={sortDir}
                    onChange={(e) => onChange({ sortDir: e.target.value })}
                >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </label>

            <label>
                Per page
                <select
                    value={size}
                    onChange={(e) => onChange({ size: Number(e.target.value) })}
                >
                    {[10, 20, 50].map((n) => (
                        <option key={n} value={n}>
                            {n}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
};

export default ProductFilter;