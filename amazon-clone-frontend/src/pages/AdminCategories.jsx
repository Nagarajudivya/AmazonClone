import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import Loader from "../components/Loader";
import categoryService from "../services/categoryService";

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toast, setToast] = useState(null);

    // Form state
    const [form, setForm] = useState({ name: "", description: "" });
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch {
            setError("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        setSubmitting(true);
        try {
            if (editingId) {
                await categoryService.updateCategory(editingId, form);
                showToast("Category updated.");
            } else {
                await categoryService.createCategory(form);
                showToast("Category created.");
            }
            setForm({ name: "", description: "" });
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            showToast(err.response?.data?.message || "Operation failed.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (cat) => {
        setEditingId(cat.id);
        setForm({ name: cat.name, description: cat.description || "" });
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete category "${name}"? This cannot be undone.`)) return;
        try {
            await categoryService.deleteCategory(id);
            showToast(`"${name}" deleted.`);
            fetchCategories();
        } catch (err) {
            showToast(err.response?.data?.message || "Delete failed.", "error");
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm({ name: "", description: "" });
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                {toast && (
                    <div className={`admin-toast admin-toast-${toast.type}`}>{toast.msg}</div>
                )}

                <div className="admin-page-header">
                    <div>
                        <h1>Categories</h1>
                        <p>{categories.length} categories</p>
                    </div>
                </div>

                {/* Create / Edit Form */}
                <div style={{ maxWidth: 500, marginBottom: "2rem", background: "#f9f9f9", padding: "1.25rem", borderRadius: 8 }}>
                    <h2 style={{ marginBottom: "1rem", fontSize: "1rem" }}>
                        {editingId ? "Edit Category" : "New Category"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "0.75rem" }}>
                            <label style={{ display: "block", marginBottom: 4, fontSize: "0.875rem" }}>
                                Name *
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                                style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </div>
                        <div style={{ marginBottom: "0.75rem" }}>
                            <label style={{ display: "block", marginBottom: 4, fontSize: "0.875rem" }}>
                                Description
                            </label>
                            <input
                                type="text"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: 4 }}
                            />
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="admin-btn admin-btn-primary"
                            >
                                {submitting ? "Saving..." : editingId ? "Update" : "Create"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-secondary"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Category Table */}
                {loading && <Loader fullPage />}
                {error && <p className="admin-error">{error}</p>}

                {!loading && !error && (
                    categories.length === 0 ? (
                        <p>No categories yet. Create one above.</p>
                    ) : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat.id}>
                                        <td>{cat.id}</td>
                                        <td>{cat.name}</td>
                                        <td>{cat.description || "—"}</td>
                                        <td className="admin-table-actions">
                                            <button
                                                className="admin-btn admin-btn-sm admin-btn-secondary"
                                                onClick={() => handleEdit(cat)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="admin-btn admin-btn-sm admin-btn-danger"
                                                onClick={() => handleDelete(cat.id, cat.name)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminCategories;