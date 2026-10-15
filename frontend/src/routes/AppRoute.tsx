import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import Auth from "../pages/Auth";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import OAuthCallback from "../pages/OAuthCallback";
import Checkout from "../pages/Checkout";
import MyOrders from "../pages/MyOrders";
import AdminDashboard from "../pages/AdminDashboard";
import TrackOrder from "../pages/TrackOrder";
import Profile from "../pages/Profile";

import NotFound from "../pages/NotFound";
import { ToastContainer } from "react-toastify";
import { useAuthStore } from "../stores/authStore";
import { useThemeStore } from "../stores/themeStore";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoute = () => {
  const { initAuth } = useAuthStore();
  const { resolvedTheme } = useThemeStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme={resolvedTheme} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/track/:orderNumber" element={<TrackOrder />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};


export default AppRoute;
