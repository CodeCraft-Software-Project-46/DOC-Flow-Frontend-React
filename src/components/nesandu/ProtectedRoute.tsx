import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
    const user = localStorage.getItem("docflow_user");

    if (!user) {
        console.warn("Access denied. Redirecting to Login.");
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};