import React, { useState, useEffect } from "react";
import "../styles/ProductFilter.css";

// Controlled search box. Calls onSearch(name) — parent maps it to
// ProductController's GET /products/search?name=... param.
const ProductSearch = ({ initialValue = "", onSearch }) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => setValue(initialValue), [initialValue]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(value.trim());
    };

    return (
        <form className="product-search" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search by product name..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button type="submit">Search</button>
            {value && (
                <button
                    type="button"
                    className="product-search-clear"
                    onClick={() => {
                        setValue("");
                        onSearch("");
                    }}
                >
                    Clear
                </button>
            )}
        </form>
    );
};

export default ProductSearch;