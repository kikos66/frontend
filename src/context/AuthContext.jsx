import { useState, useEffect, useRef } from "react";
import { AuthContext } from './AuthContextDefinition'; 
import AuthAPI from '../api/auth_api';
import UserAPI from '../api/user_api';

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCurrentUser = async () => {
        const data = await UserAPI.getUserData();
        setCurrentUser(data);
    };
    
    useEffect(() => {
        const init = async () => {
            if (localStorage.getItem("accessToken")) {
                try {
                    await fetchCurrentUser();
                    setIsAuthenticated(true);
                } catch {
                    localStorage.removeItem("accessToken");
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };
        init();
    }, []);

    const login = async (email, password) => {
        await AuthAPI.login(email, password);
        setIsAuthenticated(true);
        await fetchCurrentUser();
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
        fetchCurrentUser,
        updateUser: setCurrentUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};