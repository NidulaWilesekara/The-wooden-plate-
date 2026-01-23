import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Set base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:8000';

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
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
                errors: error.response?.data?.errors
            };
        }
    };

    const sendOTP = async ({ email }) => {
        try {
            const response = await axios.post('/api/public/send-otp', { email });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to send OTP',
                errors: error.response?.data?.errors
            };
        }
    };

    const verifyOTP = async ({ email, otp }) => {
        try {
            const response = await axios.post('/api/public/verify-otp', { email, otp });
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
                message: error.response?.data?.message || 'Invalid OTP',
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

    const isAuthenticated = () => {
        return !!token && !!customer;
    };

    const value = {
        customer,
        token,
        loading,
        register,
        sendOTP,
        verifyOTP,
        logout,
        isAuthenticated
    };

    return (
        <CustomerAuthContext.Provider value={value}>
            {children}
        </CustomerAuthContext.Provider>
    );
};
