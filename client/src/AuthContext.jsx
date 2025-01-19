import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const baseurl = "https://api.tonsvalleyeducationtrust.org"; // Replace with actual base URL for production
    
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location (URL)

    const checkAuth = async () => {
        try {
            const response = await axios.get(`${baseurl}/get/user`, { withCredentials: true });
            setUser(response.data.user);

            if (response.data.user) {
                if (location.pathname === '/admin' || location.pathname.startsWith('/admin/')) {
                    navigate(`${location.pathname}`)
                } else {
                    navigate('/admin');
                }
            } else {
                navigate('/');
                console.log("else conditio running")
            }
        } catch (error) {
            console.error('User is not authenticated', error);
            // navigate('/'); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async ({ email, password }) => {
        setLoading(true);
        try {
            const response = await axios.post(`${baseurl}/login`, { email, password }, { withCredentials: true });
            console.log(response);
            checkAuth(); // After login, check authentication status.
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await axios.post(`${baseurl}/logout`, {}, { withCredentials: true });
            setUser(null);
            navigate('/login'); // Redirect to login page after logout
        } catch (error) {
            console.error('Logout failed', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        baseurl,
        user,
        login,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            <>{children}</>
        </AuthContext.Provider>
    );
};
