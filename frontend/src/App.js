import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./service/Guard";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import DeliveryPage from "./pages/Delivery/DeliveryPage";
import ExpenseRecordsPage from "./pages/Expenses/ExpensePage";
import LocationsPage from "./pages/LocationsPage";
import VendorPage from "./pages/Vendor/VendorPage";
import RiderPage from "./pages/Rider/RiderPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

        {/* Public routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin-only routes */}
        <Route path="/dashboard" element={<AdminRoute element={<DashboardPage />} />} />
        <Route path="/locations" element={<AdminRoute element={<LocationsPage />} />} />
        <Route path="/vendors" element={<AdminRoute element={<VendorPage />} />} />
        <Route path="/riders" element={<AdminRoute element={<RiderPage />} />} />

        {/* Protected routes accessible by any logged-in user */}
        <Route path="/orders" element={<ProtectedRoute element={<DeliveryPage />} />} />
        <Route path="/expenses" element={<ProtectedRoute element={<ExpenseRecordsPage />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
      </Routes>
    </Router>
  );
}

export default App;
