import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import ForgotPasswordPage from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import ServiceDetails from "../pages/ServiceDetails";
import tokenService from "../utils/tokenService";
import OrdersPage from "../pages/Orders";
import NotificationsPage from "../pages/Notifications";
import ProfilePage from "../pages/Profile";
import SavedPage from "../pages/Saved";
import AboutUsPage from "../pages/AboutUs";



function PrivateRoute({ children }) {
    return tokenService.isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default function AppRoutes() {
    return (
        <Routes>
            {/* If visiting root, redirect to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public Auth Routes */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Dashboard Route */}
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />

            {/* Service Details in New Tab */}
            <Route path="/service/:id" element={<ServiceDetails />} />
            <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route
                path="/notifications"
                element={
                    <PrivateRoute>
                        <NotificationsPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <ProfilePage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/saved"
                element={
                    <PrivateRoute>
                        <SavedPage />
                    </PrivateRoute>
                }
            />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}