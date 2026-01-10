import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, sendOTP, verifyOTP } = useCustomerAuth();
    const [step, setStep] = useState(1); // 1: email, 2: OTP
    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOTP] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await sendOTP({ email });

        if (result.success) {
            toast.success('OTP sent to your email!');
            setStep(2);
        } else {
            setError(result.message);
            toast.error(result.message);
        }
        setLoading(false);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await verifyOTP({ email, otp });

        if (result.success) {
            toast.success('Login successful!');
            navigate('/my-orders');
        } else {
            setError(result.message);
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {step === 1 ? 'Enter your email to receive OTP' : 'Enter the OTP sent to your email'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-medium text-amber-600 hover:text-amber-500">
                                    Sign up
                                </Link>
                            </p>
                        </div>

                        <div className="text-center pt-4 border-t border-gray-200">
                            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
                                ← Back to Home
                            </Link>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                Enter OTP
                            </label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                required
                                value={otp}
                                onChange={(e) => setOTP(e.target.value)}
                                maxLength="6"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-center text-2xl tracking-widest"
                                placeholder="000000"
                            />
                            <p className="mt-1 text-sm text-gray-500 text-center">
                                OTP sent to {email}
                            </p>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Verifying...' : 'Verify & Login'}
                            </button>
                        </div>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                ← Change email
                            </button>
                        </div>

                        <div className="text-center pt-4 border-t border-gray-200">
                            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
                                ← Back to Home
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
