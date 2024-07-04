/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = () => {
        setIsLoggingOut(false)
        logout();
        <Navigate to="/auth/signin" />
    };

    
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        
        if (storedToken) {
            fetchUser(storedToken).then(userData => {
                setUser(userData);
                startTokenExpiryTimer(storedToken);
                setLoading(false);
            }).catch(error => {
                console.error('Failed to fetch user:', error);
                setLoading(false);
                localStorage.removeItem('jwtToken');
            });
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const response = await axios.get('/accounts/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    };

    const startTokenExpiryTimer = (token) => {
        const { exp } = jwtDecode(token);
        const expiryTime = exp * 1000 - Date.now();

        setTimeout(() => {
            setSessionExpired(true);
            // logout(true);
        }, expiryTime);
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/accounts/authenticate', { email, password });
            const { jwtToken, ...userData } = response.data;

            localStorage.setItem('jwtToken', jwtToken);
            setUser(userData);
            startTokenExpiryTimer(jwtToken);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = (isSessionExpired = false) => {
        localStorage.removeItem('jwtToken');
        setUser(null);
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        if (isSessionExpired) {
            toast.error('Session expired, please login again!');
            setSessionExpired(false);
            setIsLoggingOut(false)
        }
        else {
            toast.success('Logged out successfully!');
        }
    };

    const refreshToken = async () => {
        try {
            const response = await axios.post('/accounts/refresh-token');

            localStorage.setItem('jwtToken', response.data.jwtToken);
            setUser(prevUser => ({ ...prevUser, ...response.data }));
            startTokenExpiryTimer(response.data.jwtToken);
        } catch (error) {
            console.error('Refresh token error:', error);
            logout();
        }
    };

    const isAuthenticated = () => {
        return !!user;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshToken, isAuthenticated, sessionExpired, isLoggingOut, setIsLoggingOut, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
