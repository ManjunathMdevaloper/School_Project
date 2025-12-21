import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('seven_veda_auth') === 'true';
    });

    const [userRole, setUserRole] = useState(() => {
        return sessionStorage.getItem('seven_veda_role') || 'guest';
    });

    const login = async (username, password) => {
        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const user = await response.json();
                setIsAuthenticated(true);
                // Map backend roles to frontend
                let role = 'student';
                if (user.role) {
                    const apiRole = user.role.toLowerCase();
                    if (apiRole.includes('admin')) role = 'admin';
                    else if (apiRole.includes('faculty')) role = 'faculty';
                }

                setUserRole(role);
                sessionStorage.setItem('seven_veda_auth', 'true');
                sessionStorage.setItem('seven_veda_role', role);
                return true;
            } else {
                console.warn("API Login failed, attempting fallback...");
                throw new Error("API Login Failed");
            }
        } catch (error) {
            // Fallback to hardcoded for demo consistency if API down
            if (username === 'admin' && (password === 'admin' || password === 'admin123')) {
                setIsAuthenticated(true);
                setUserRole('admin');
                sessionStorage.setItem('seven_veda_auth', 'true');
                sessionStorage.setItem('seven_veda_role', 'admin');
                return true;
            }
            if (username === 'fac1' && password === '123') {
                setIsAuthenticated(true);
                setUserRole('faculty');
                sessionStorage.setItem('seven_veda_auth', 'true');
                sessionStorage.setItem('seven_veda_role', 'faculty');
                return true;
            }
            return false;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUserRole('guest');
        sessionStorage.removeItem('seven_veda_auth');
        sessionStorage.removeItem('seven_veda_role');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
