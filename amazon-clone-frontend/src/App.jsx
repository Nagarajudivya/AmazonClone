// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
//
// function App() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>
//
//       <div className="ticks"></div>
//
//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>
//
//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }
//
// export default App


// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";
//
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import DashboardPage from "./pages/DashboardPage";
// import ProductListPage from "./pages/ProductListPage";
// import ProductDetailsPage from "./pages/ProductDetailsPage";
// import CreateProductPage from "./pages/CreateProductPage";
// import EditProductPage from "./pages/EditProductPage";
// import NotFoundPage from "./pages/NotFoundPage";
//
// const App = () => {
//   return (
//       <div className="app-shell">
//         <Navbar />
//         <main className="app-content">
//           <Routes>
//             <Route path="/" element={<Navigate to="/products" replace />} />
//
//             {/* Public */}
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/register" element={<RegisterPage />} />
//             <Route path="/products" element={<ProductListPage />} />
//             <Route path="/products/:id" element={<ProductDetailsPage />} />
//
//             {/* Authenticated */}
//             <Route
//                 path="/dashboard"
//                 element={
//                   <ProtectedRoute>
//                     <DashboardPage />
//                   </ProtectedRoute>
//                 }
//             />
//
//             {/* Admin only */}
//             <Route
//                 path="/products/create"
//                 element={
//                   <ProtectedRoute requireAdmin>
//                     <CreateProductPage />
//                   </ProtectedRoute>
//                 }
//             />
//             <Route
//                 path="/products/:id/edit"
//                 element={
//                   <ProtectedRoute requireAdmin>
//                     <EditProductPage />
//                   </ProtectedRoute>
//                 }
//             />
//
//             <Route path="*" element={<NotFoundPage />} />
//           </Routes>
//         </main>
//       </div>
//   );
// };
//
// export default App;



import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

// Public / user pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

// Admin pages (live under /admin/*)
import AdminDashboard from "./pages/AdminDashboard";
import AdminProductList from "./pages/AdminProductList";
import AdminCreateProduct from "./pages/AdminCreateProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminCategories from "./pages/AdminCategories";

const App = () => {
    return (
        <div className="app-shell">
            {/* Navbar is hidden on /admin routes — AdminLayout has its own sidebar */}
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
                                    <Route path="*" element={<NotFoundPage />} />
                                </Routes>
                            </main>
                        </>
                    }
                />
            </Routes>
        </div>
    );
};

export default App;