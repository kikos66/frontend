import { useState, useEffect, useRef } from "react";
import { AuthContext } from './AuthContextDefinition'; 
import AuthAPI from '../api/auth_api';
import UserAPI from '../api/user_api';

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCurrentUser = async () => {
        try {
            const data = await UserAPI.getUserData();
            setCurrentUser(data);
        } catch (error) {
            console.error("Failed to fetch current user data:", error);
            setCurrentUser(null); 
        }
    };
    
    useEffect(() => {
        if (isAuthenticated && !currentUser) {
            fetchCurrentUser();
        }
    }, [isAuthenticated]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            await AuthAPI.login(email, password);
            setIsAuthenticated(true);
            await fetchCurrentUser();
        } catch (error) {
            setIsAuthenticated(false);
            setCurrentUser(null);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await AuthAPI.logout();
        setIsAuthenticated(false);
        setCurrentUser(null);
    };

    const updateUser = (userData) => {
        setCurrentUser(userData);
    };

    const value = {
        isAuthenticated,
        currentUser,
        loading,
        login,
        logout,
        updateUser,
        fetchCurrentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};