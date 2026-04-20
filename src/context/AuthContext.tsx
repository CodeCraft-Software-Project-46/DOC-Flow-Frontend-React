import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// When we open JWT Token it must contain these fields, so we define an interface for it
interface DecodedUser {
    user_id: number;
    username: string;
    roles: string[];
    permissions: string[];
}

// Shape of AuthContext. User is either a DecodedUser or null.
// If User is logged in, we show their info and give them the option to logout. If not logged in, we show them the option to login.
interface AuthContextType {
    user: DecodedUser | null;
    login: (access_token: string, refresh_token: string) => void;
    logout: () => void;
    loading: boolean;
}

// 2. Create the Context with a default value of null
// Context object is a way to pass data through the component tree without having to pass props down manually at every level.
// createContext is a function that creates a Context object. Blueprint for a communication channel.
// We are using createContext to build a specific channel. We name it AuthContext. We tell it to follow our checklist (AuthContextType) and we give it a default value of null (because when the app first loads, we don't know if the user is logged in or not).
// . Provider and .Consumer are given to this AuthContext by react. 
// .Provider is the input side. It allows us to set the value of the context (in our case, user info and login/logout functions). We will use this in our AuthProvider component.
// .Consumer is the output side.We use useContext instead nowadays.

export const AuthContext = createContext<AuthContextType | null>(null);

// This AuthProvider will wrap our entire app and provide the AuthContext to all components. 
// It will also handle the logic for logging in and out, and checking if the user is already logged in when the app loads.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<DecodedUser | null>(null);
    const [loading, setLoading] = useState(true);

    // When the app loads, check if they already have a token saved
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedUser>(token); // We use jwtDecode to decode the token and get the user info out of it. 
                setUser(decoded);
            } catch (error) {
                console.error("Invalid token found");
                logout();
            }
        }
        setLoading(false);
    }, []);

    // Function to call when SignIn.tsx gets a successful response from Django
    const login = (access_token: string, refresh_token: string) => {
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        const decoded = jwtDecode<DecodedUser>(access_token);
        setUser(decoded); // This instantly updates the whole app!
    };

    // Function to wipe memory
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};