// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminRoute from "./routes/AdminRoute";
//
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import ProductListPage from "./pages/ProductListPage";
// import ProductDetailsPage from "./pages/ProductDetailsPage";
// import DashboardPage from "./pages/DashboardPage";
// import NotFoundPage from "./pages/NotFoundPage";
//
// import AdminDashboard from "./pages/AdminDashboard";
// import AdminProductList from "./pages/AdminProductList";
// import AdminCreateProduct from "./pages/AdminCreateProduct";
// import AdminEditProduct from "./pages/AdminEditProduct";
// import AdminCategories from "./pages/AdminCategories";
//
// const App = () => {
//     return (
//         <div className="app-shell">
//             <Routes>
//                 <Route
//                     path="/admin"
//                     element={
//                         <AdminRoute>
//                             <AdminDashboard />
//                         </AdminRoute>
//                     }
//                 />
//                 <Route
//                     path="/admin/products"
//                     element={
//                         <AdminRoute>
//                             <AdminProductList />
//                         </AdminRoute>
//                     }
//                 />
//                 <Route
//                     path="/admin/products/add"
//                     element={
//                         <AdminRoute>
//                             <AdminCreateProduct />
//                         </AdminRoute>
//                     }
//                 />
//                 <Route
//                     path="/admin/products/edit/:id"
//                     element={
//                         <AdminRoute>
//                             <AdminEditProduct />
//                         </AdminRoute>
//                     }
//                 />
//                 <Route
//                     path="/admin/categories"
//                     element={
//                         <AdminRoute>
//                             <AdminCategories />
//                         </AdminRoute>
//                     }
//                 />
//
//                 <Route
//                     path="/*"
//                     element={
//                         <>
//                             <Navbar />
//                             <main className="app-content">
//                                 <Routes>
//                                     <Route path="/" element={<Navigate to="/products" replace />} />
//                                     <Route path="/login" element={<LoginPage />} />
//                                     <Route path="/register" element={<RegisterPage />} />
//                                     <Route path="/products" element={<ProductListPage />} />
//                                     <Route path="/products/:id" element={<ProductDetailsPage />} />
//                                     <Route
//                                         path="/dashboard"
//                                         element={
//                                             <ProtectedRoute>
//                                                 <DashboardPage />
//                                             </ProtectedRoute>
//                                         }
//                                     />
//                                     <Route path="*" element={<NotFoundPage />} />
//                                 </Routes>
//                             </main>
//                         </>
//                     }
//                 />
//             </Routes>
//         </div>
//     );
// };
//
// export default App;



import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import { CartProvider } from "./context/CartContext";

// Public / user pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import Cart from "./pages/Cart/Cart";             // NEW

// Admin pages (live under /admin/*)
import AdminDashboard from "./pages/AdminDashboard";
import AdminProductList from "./pages/AdminProductList";
import AdminCreateProduct from "./pages/AdminCreateProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminCategories from "./pages/AdminCategories";

const App = () => {
    return (
        // CartProvider wraps everything so both Navbar and pages can read cart state
        <CartProvider>
            <div className="app-shell">
                <Routes>
                    {/* ── Admin section (no top Navbar, uses AdminLayout internally) ── */}
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/products"
                        element={
                            <AdminRoute>
                                <AdminProductList />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/products/add"
                        element={
                            <AdminRoute>
                                <AdminCreateProduct />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/products/edit/:id"
                        element={
                            <AdminRoute>
                                <AdminEditProduct />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/admin/categories"
                        element={
                            <AdminRoute>
                                <AdminCategories />
                            </AdminRoute>
                        }
                    />

                    {/* ── Public / user section (has top Navbar) ── */}
                    <Route
                        path="/*"
                        element={
                            <>
                                <Navbar />
                                <main className="app-content">
                                    <Routes>
                                        <Route path="/" element={<Navigate to="/products" replace />} />
                                        <Route path="/login" element={<LoginPage />} />
                                        <Route path="/register" element={<RegisterPage />} />
                                        <Route path="/products" element={<ProductListPage />} />
                                        <Route path="/products/:id" element={<ProductDetailsPage />} />
                                        <Route
                                            path="/dashboard"
                                            element={
                                                <ProtectedRoute>
                                                    <DashboardPage />
                                                </ProtectedRoute>
                                            }
                                        />
                                        {/* NEW: Cart route */}
                                        <Route
                                            path="/cart"
                                            element={
                                                <ProtectedRoute>
                                                    <Cart />
                                                </ProtectedRoute>
                                            }
                                        />
                                        <Route path="*" element={<NotFoundPage />} />
                                    </Routes>
                                </main>
                            </>
                        }
                    />
                </Routes>
            </div>
        </CartProvider>
    );
};

export default App;