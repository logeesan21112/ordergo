import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import ApiService from "./ApiService";

/**
 * ProtectedRoute
 * Only allows access if user is authenticated.
 * Redirects to /login if not authenticated.
 * 
 * Usage:
 * <ProtectedRoute element={<YourComponent />} />
 */
export const ProtectedRoute = ({ element: Component }) => {
  const location = useLocation();

  return ApiService.isAuthenticated() ? (
    Component
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

/**
 * AdminRoute
 * Only allows access if user has ADMIN role.
 * Redirects to /login if not an admin.
 * 
 * Usage:
 * <AdminRoute element={<AdminComponent />} />
 */
export const AdminRoute = ({ element: Component }) => {
  const location = useLocation();

  return ApiService.isAdmin() ? (
    Component
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};
