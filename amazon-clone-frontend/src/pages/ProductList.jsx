import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import productService from "../services/productService";
import "../styles/ProductList.css";

const PLACEHOLDER =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><rect width='100%25' height='100%25' fill='%23f0f0f0'/><text x='50%25' y='50%25' fill='%23aaa' font-size='10' text-anchor='middle' dy='.3em'>No img</text></svg>";

const ProductList = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [page, setPage] = useState(0);
    const [deletingId, setDeletingId] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const data = search
                ? await productService.searchProducts({ name: search, page, size: 10 })
                : await productService.getAllProducts({ page, size: 10, sortBy: "createdAt", sortDir: "desc" });
            setPageData(data);
        } catch {
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(0);
        setSearch(searchInput.trim());
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            await productService.deleteProduct(id);
            showToast(`"${name}" deleted successfully.`);
            fetchProducts();
        } catch {
            showToast("Failed to delete product.", "error");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                {/* Toast */}
                {toast && (
                    <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>
                )}

                <div className="admin-page-header">
                    <div>
                        <h1>Products</h1>
                        <p>{pageData?.totalElements ?? 0} total products</p>
                    </div>
                    <Link to="/admin/products/add" className="admin-btn admin-btn-primary">
                        + Add Product
                    </Link>
                </div>

                {/* Search bar */}
                <form className="admin-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search by product name..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button type="submit">Search</button>
                    {search && (
                        <button type="button" onClick={() => { setSearch(""); setSearchInput(""); setPage(0); }}>
                            Clear
                        </button>
                    )}
                </form>

                {loading && <Loader fullPage />}
                {error && <p className="admin-error">{error}</p>}

                {!loading && !error && pageData && (
                    <>
                        {pageData.content.length === 0 ? (
                            <div className="admin-empty">
                                <p>No products found.</p>
                                <Link to="/admin/products/add" className="admin-btn admin-btn-primary">
                                    Add your first product
                                </Link>
                            </div>
                        ) : (
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {pageData.content.map((p) => {
                                        const imgUrl =
                                            p.images?.find((i) => i.isPrimary)?.imageUrl ||
                                            p.images?.[0]?.imageUrl ||
                                            PLACEHOLDER;
                                        return (
                                            <tr key={p.id}>
                                                <td>
                                                    <img src={imgUrl} alt={p.name} className="admin-table-img" />
                                                </td>
                                                <td>
                                                    <span className="admin-table-name">{p.name}</span>
                                                    {p.brand && <span className="admin-table-brand">{p.brand}</span>}
                                                </td>
                                                <td>{p.category?.name ?? "—"}</td>
                                                <td>₹{Number(p.price).toFixed(2)}</td>
                                                <td>
                            <span className={`stock-badge ${p.stockQuantity < 10 ? "low" : "ok"}`}>
                              {p.stockQuantity}
                            </span>
                                                </td>
                                                <td className="admin-table-actions">
                                                    <Link
                                                        to={`/admin/products/edit/${p.id}`}
                                                        className="admin-btn admin-btn-sm admin-btn-secondary"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        className="admin-btn admin-btn-sm admin-btn-danger"
                                                        disabled={deletingId === p.id}
                                                        onClick={() => handleDelete(p.id, p.name)}
                                                    >
                                                        {deletingId === p.id ? "..." : "Delete"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <Pagination
                            pageNumber={pageData.pageNumber}
                            totalPages={pageData.totalPages}
                            last={pageData.last}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>
        </AdminLayout>
    );
};

export default ProductList;