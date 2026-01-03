import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CustomerAuthContext = createContext();

export const useCustomerAuth = () => {
    const context = useContext(CustomerAuthContext);
    if (!context) {
        throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
    }
    return context;
};

export const CustomerAuthProvider = ({ children }) => {
    const [customer, setCustomer] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('customerToken');
        const storedCustomer = localStorage.getItem('customer');

        if (storedToken && storedCustomer) {
            setToken(storedToken);
            setCustomer(JSON.parse(storedCustomer));
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    const register = async (userData) => {
        try {
            const response = await axios.post('/api/public/register', userData);
            const { customer: newCustomer, token: newToken } = response.data;

            setCustomer(newCustomer);
            setToken(newToken);
            localStorage.setItem('customerToken', newToken);
            localStorage.setItem('customer', JSON.stringify(newCustomer));
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
                errors: error.response?.data?.errors
            };
        }
    };

    const login = async (credentials) => {
        try {
            const response = await axios.post('/api/public/login', credentials);
            const { customer: loggedInCustomer, token: newToken } = response.data;

            setCustomer(loggedInCustomer);
            setToken(newToken);
            localStorage.setItem('customerToken', newToken);
            localStorage.setItem('customer', JSON.stringify(loggedInCustomer));
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
                errors: error.response?.data?.errors
            };
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await axios.post('/api/customer/logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setCustomer(null);
            setToken(null);
            localStorage.removeItem('customerToken');
            localStorage.removeItem('customer');
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await axios.post('/api/public/forgot-password', { email });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to send reset link',
                errors: error.response?.data?.errors
            };
        }
    };

    const resetPassword = async (resetData) => {
        try {
            const response = await axios.post('/api/public/reset-password', resetData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Password reset failed',
                errors: error.response?.data?.errors
            };
        }
    };

    const isAuthenticated = () => {
        return !!token && !!customer;
    };

    const value = {
        customer,
        token,
        loading,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        isAuthenticated
    };

    return (
        <CustomerAuthContext.Provider value={value}>
            {children}
        </CustomerAuthContext.Provider>
    );
};
