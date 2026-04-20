import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const authContext = useContext(AuthContext);

    // 1. THE WAITING ROOM (This is the new part!)
    // If the vault is still checking the hard drive, show a loading message
    if (authContext?.loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <h2>Loading secure environment...</h2>
            </div>
        );
    }

    // 2. The checking is done. If the vault is empty, kick them out!
    if (!authContext || !authContext.user) {
        console.warn("Access denied: No valid token. Redirecting to Login.");
        return <Navigate to="/" replace />;
    }

    // 3. They have a real token. Open the door!
    return <Outlet />;
};