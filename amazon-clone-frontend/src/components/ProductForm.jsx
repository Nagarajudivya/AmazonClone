import React, { useEffect, useState } from "react";
import categoryService from "../services/categoryService";
import "../styles/ProductForm.css";

// initialValues maps to ProductResponse when editing, otherwise empty for create.
// onSubmit receives a payload shaped exactly like ProductRequest:
// { name, description, price, stockQuantity, brand, categoryId }
const ProductForm = ({ initialValues, onSubmit, submitting, submitLabel = "Save Product" }) => {
    const [form, setForm] = useState({
        name: initialValues?.name || "",
        description: initialValues?.description || "",
        price: initialValues?.price ?? "",
        stockQuantity: initialValues?.stockQuantity ?? "",
        brand: initialValues?.brand || "",
        categoryId: initialValues?.category?.id || "",
    });
    const [categories, setCategories] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({});
    const [categoriesError, setCategoriesError] = useState("");

    useEffect(() => {
        categoryService
            .getAllCategories()
            .then(setCategories)
            .catch(() => setCategoriesError("Could not load categories."));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Client-side validation mirrors the backend's @NotBlank / @NotNull / @DecimalMin / @Min rules
    const validate = () => {
        const errors = {};
        if (!form.name.trim()) errors.name = "Product name is required";
        if (form.price === "" || Number(form.price) <= 0)
            errors.price = "Price must be greater than 0";
        if (form.stockQuantity === "" || Number(form.stockQuantity) < 0)
            errors.stockQuantity = "Stock quantity cannot be negative";
        if (!form.categoryId) errors.categoryId = "Category is required";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        onSubmit({
            name: form.name.trim(),
            description: form.description.trim(),
            price: Number(form.price),
            stockQuantity: Number(form.stockQuantity),
            brand: form.brand.trim() || null,
            categoryId: Number(form.categoryId),
        });
    };

    return (
        <form className="product-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input id="name" name="name" value={form.name} onChange={handleChange} />
                {fieldErrors.name && <span className="form-error">{fieldErrors.name}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="price">Price (₹) *</label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={handleChange}
                    />
                    {fieldErrors.price && <span className="form-error">{fieldErrors.price}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="stockQuantity">Stock Quantity *</label>
                    <input
                        id="stockQuantity"
                        name="stockQuantity"
                        type="number"
                        min="0"
                        value={form.stockQuantity}
                        onChange={handleChange}
                    />
                    {fieldErrors.stockQuantity && (
                        <span className="form-error">{fieldErrors.stockQuantity}</span>
                    )}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="brand">Brand</label>
                    <input id="brand" name="brand" value={form.brand} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="categoryId">Category *</label>
                    <select
                        id="categoryId"
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                    >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {fieldErrors.categoryId && (
                        <span className="form-error">{fieldErrors.categoryId}</span>
                    )}
                    {categoriesError && <span className="form-error">{categoriesError}</span>}
                </div>
            </div>

            <button type="submit" className="product-form-submit" disabled={submitting}>
                {submitting ? "Saving..." : submitLabel}
            </button>
        </form>
    );
};

export default ProductForm;