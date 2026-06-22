import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProductCard from "../components/ProductCard";
import ProductSearch from "../components/ProductSearch";
import ProductFilter from "../components/ProductFilter";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";
import productService from "../services/productService";
import "../styles/ProductList.css";

const ProductListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const name = searchParams.get("name") || "";
    const categoryId = searchParams.get("categoryId")
        ? Number(searchParams.get("categoryId"))
        : null;
    const page = Number(searchParams.get("page") || 0);
    const size = Number(searchParams.get("size") || 10);
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortDir = searchParams.get("sortDir") || "desc";

    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const updateParams = (updates) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, val]) => {
            if (val === null || val === "" || val === undefined) next.delete(key);
            else next.set(key, val);
        });
        // Any filter/sort change resets to first page
        if (!("page" in updates)) next.set("page", "0");
        setSearchParams(next);
    };

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            // Use /products/search whenever a name or category filter is active
            // (mirrors backend split between getAllProducts and searchProducts),
            // otherwise use plain /products which supports sorting.
            let data;
            if (name || categoryId) {
                data = await productService.searchProducts({ name, categoryId, page, size });
            } else {
                data = await productService.getAllProducts({ page, size, sortBy, sortDir });
            }
            setPageData(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load products.");
        } finally {
            setLoading(false);
        }
    }, [name, categoryId, page, size, sortBy, sortDir]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="product-list-page">
            <Sidebar
                activeCategoryId={categoryId}
                onSelectCategory={(id) => updateParams({ categoryId: id })}
            />

            <div className="product-list-main">
                <ProductSearch initialValue={name} onSearch={(val) => updateParams({ name: val })} />

                <ProductFilter
                    sortBy={sortBy}
                    sortDir={sortDir}
                    size={size}
                    onChange={updateParams}
                />

                {loading && <Loader fullPage />}
                {error && <p className="product-list-error">{error}</p>}

                {!loading && !error && pageData && (
                    <>
                        <p className="product-list-count">
                            {pageData.totalElements} product{pageData.totalElements !== 1 ? "s" : ""} found
                        </p>

                        {pageData.content.length === 0 ? (
                            <p className="product-list-empty">No products match your filters.</p>
                        ) : (
                            <div className="product-grid">
                                {pageData.content.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        <Pagination
                            pageNumber={pageData.pageNumber}
                            totalPages={pageData.totalPages}
                            last={pageData.last}
                            onPageChange={(p) => updateParams({ page: p })}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductListPage;