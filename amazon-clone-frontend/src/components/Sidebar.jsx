import React, { useEffect, useState } from "react";
import categoryService from "../services/categoryService";
import "../styles/Sidebar.css";

// activeCategoryId / onSelectCategory let the parent (ProductListPage) drive state
const Sidebar = ({ activeCategoryId, onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data);
            } catch (err) {
                setError("Unable to load categories.");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <aside className="sidebar">
            <h3 className="sidebar-title">Categories</h3>
            {loading && <p className="sidebar-status">Loading...</p>}
            {error && <p className="sidebar-status sidebar-error">{error}</p>}

            {!loading && !error && (
                <ul className="sidebar-list">
                    <li>
                        <button
                            className={!activeCategoryId ? "active" : ""}
                            onClick={() => onSelectCategory(null)}
                        >
                            All Products
                        </button>
                    </li>
                    {categories.map((cat) => (
                        <li key={cat.id}>
                            <button
                                className={activeCategoryId === cat.id ? "active" : ""}
                                onClick={() => onSelectCategory(cat.id)}
                            >
                                {cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
};

export default Sidebar;