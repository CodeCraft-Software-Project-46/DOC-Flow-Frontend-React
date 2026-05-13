import { Navigate, Outlet } from 'react-router';// Used for frontend security, checks if user is logged in, if not redirects to login page

// Define the roles explicitly so you don't make typos later
export type UserRole = 'Admin' | 'Manager' | 'Employee' | 'Auditor' | 'External'; // defines possible user roles

interface ProtectedRouteProps { // You can expand this in the future if you want to add role-based access control
  allowedRoles?: UserRole[]; // Optional prop to specify which roles can access this route. If not provided, all authenticated users can access.
}

export const ProtectedRoute = () => {  // security component that checks if user is authenticated before allowing access to certain routes
    // Check the flag we set in LoginPage
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"; //Get value from localStorage & Check if it equals "true"

    // Debugging: Check console if it still fails
    if (!isAuthenticated) { //If NOT authenticated Show warning in console
        console.warn("Access denied. Redirecting to Login.");
        return <Navigate to="/" replace />; // Redirect to login page if not authenticated
    }

    return <Outlet />; // If authenticated, Show the requested page,Render child routes
};