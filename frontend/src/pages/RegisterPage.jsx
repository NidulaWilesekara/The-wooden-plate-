import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import toast from 'react-hot-toast';

// Food image for the side panel
const registerImage = '/images/register-food.jpg';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useCustomerAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const result = await register(formData);

        if (result.success) {
            toast.success('Registration successful! Please login with your email.');
            navigate('/login', { state: { email: formData.email } });
        } else {
            if (result.errors) {
                setErrors(result.errors);
                Object.values(result.errors).flat().forEach(msg => toast.error(msg));
            } else {
                toast.error(result.message);
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image (2/3 of screen) */}
            <div className="hidden lg:flex lg:w-2/3 relative">
                <img
                    src={registerImage}
                    alt="Delicious Food"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
                
                {/* Content on image */}
                <div className="relative z-10 flex flex-col justify-center p-12 text-white">
                    <h1 className="text-5xl font-bold mb-4">Join Our Family!</h1>
                    <p className="text-xl text-gray-200 max-w-md">
                        Create an account to discover amazing dishes and enjoy exclusive offers.
                    </p>
                    
                    {/* Features list */}
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-gray-200">Quick & Easy Ordering</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-gray-200">Track Your Orders</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-gray-200">Exclusive Offers & Discounts</span>
                        </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="mt-8 flex items-center gap-4">
                        <div className="w-12 h-1 bg-amber-500 rounded-full" />
                        <span className="text-amber-400 font-medium">The Wooden Plate</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Form (1/3 of screen) */}
            <div className="w-full lg:w-1/3 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-6 lg:p-8 overflow-y-auto">
                <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-xl">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join us to start ordering
                    </p>
                </div>

                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        {errors.general}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name *
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="0771234567"
                                maxLength="10"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone[0]}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="123 Main St, City"
                            />
                            {errors.address && (
                                <p className="mt-1 text-sm text-red-600">{errors.address[0]}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            📧 After registration, you can login using your email. We'll send you an OTP code.
                        </p>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-amber-600 hover:text-amber-500">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <div className="text-center pt-4 border-t border-gray-200">
                        <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
                            ← Back to Home
                        </Link>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
