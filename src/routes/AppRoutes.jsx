import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

/* ── Eager loads ── */
import Home from "../pages/Home/Home";

/* ── Lazy loads ── */
const Blogs = lazy(() => import("../pages/Blogs/Blogs"));
const BlogDetail = lazy(() => import("../pages/BlogDetail/BlogDetail"));
const Categories = lazy(() => import("../pages/Categories/Categories"));
const About = lazy(() => import("../pages/About/About"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const Login = lazy(() => import("../pages/Auth/Login"));
const Register = lazy(() => import("../pages/Auth/Register"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

/* ── Admin ── */
const AdminLayout = lazy(() => import("../admin/AdminLayout/AdminLayout"));
const Dashboard = lazy(() => import("../admin/Dashboard/Dashboard"));
const ManageBlogs = lazy(() => import("../admin/ManageBlogs/ManageBlogs"));
const ManageUsers = lazy(() => import("../admin/ManageUsers/ManageUsers"));
const ManageCategories = lazy(
  () => import("../admin/ManageCategories/ManageCategories"),
);
const BlogEditor = lazy(() => import("../admin/BlogEditor/BlogEditor"));
const Analytics = lazy(() => import("../admin/Analytics/Analytics"));

const PageFallback = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
    }}
  >
    <div
      className="animate-spin"
      style={{
        width: 36,
        height: 36,
        border: "3px solid var(--border-color)",
        borderTopColor: "var(--color-primary)",
        borderRadius: "50%",
      }}
    />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* ── Public routes ── */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:slug" element={<Blogs />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* ── Auth routes ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ── Protected routes ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* ── Admin routes ── */}
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="blogs/new" element={<BlogEditor />} />
            <Route path="blogs/edit/:id" element={<BlogEditor />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
