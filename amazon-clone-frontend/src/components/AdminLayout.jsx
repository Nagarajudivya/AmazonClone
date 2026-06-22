import React from "react";
import AdminSidebar from "./AdminSidebar";
import "../styles/AdminLayout.css";

// Wraps every admin page with the sidebar + content area.
// Usage: <AdminLayout><YourPage /></AdminLayout>
const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-layout-content">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;