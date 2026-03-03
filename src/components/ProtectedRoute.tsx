import { Navigate, Outlet } from 'react-router';

// Define the roles explicitly so you don't make typos later
export type UserRole = 'Admin' | 'Manager' | 'Employee' | 'Auditor' | 'External';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = () => {
    // Check the flag we set in LoginPage
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    // Debugging: Check console if it still fails
    if (!isAuthenticated) {
        console.warn("Access denied. Redirecting to Login.");
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};