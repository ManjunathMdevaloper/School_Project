import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('sri_sudha_auth') === 'true';
    });

    const [userRole, setUserRole] = useState(() => {
        return sessionStorage.getItem('sri_sudha_role') || 'guest';
    });

    const login = (username, password) => {
        if (username === 'admin' && password === 'admin') {
            setIsAuthenticated(true);
            setUserRole('admin');
            sessionStorage.setItem('sri_sudha_auth', 'true');
            sessionStorage.setItem('sri_sudha_role', 'admin');
            return true;
        }
        if (username === 'fac1' && password === '123') {
            setIsAuthenticated(true);
            setUserRole('faculty');
            sessionStorage.setItem('sri_sudha_auth', 'true');
            sessionStorage.setItem('sri_sudha_role', 'faculty');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserRole('guest');
        sessionStorage.removeItem('sri_sudha_auth');
        sessionStorage.removeItem('sri_sudha_role');
        localStorage.removeItem('sri_sudha_auth');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
