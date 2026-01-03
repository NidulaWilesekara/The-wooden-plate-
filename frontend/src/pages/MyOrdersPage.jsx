import React, { useState, useEffect } from 'react';
import { useCustomerAuth } from '../contexts/CustomerAuthContext';
import axios from 'axios';

const MyOrdersPage = () => {
    const { customer } = useCustomerAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/customer/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            preparing: 'bg-blue-100 text-blue-800',
            ready: 'bg-green-100 text-green-800',
            completed: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Welcome back, <strong>{customer?.name}</strong>!
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Start ordering delicious food from our menu!</p>
                        <div className="mt-6">
                            <a
                                href="/menu"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
                            >
                                Browse Menu
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Order #{order.order_number || order.id}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="space-y-2">
                                            {order.items && order.items.map((item, index) => (
                                                <div key={index} className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        {item.quantity}x {item.name}
                                                    </span>
                                                    <span className="text-gray-900 font-medium">
                                                        Rs. {(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                            <span className="text-base font-semibold text-gray-900">Total</span>
                                            <span className="text-lg font-bold text-amber-600">
                                                Rs. {order.total?.toFixed(2)}
                                            </span>
                                        </div>

                                        {order.order_type && (
                                            <div className="mt-3 text-sm text-gray-600">
                                                <span className="font-medium">Type:</span> {order.order_type}
                                            </div>
                                        )}

                                        {order.delivery_address && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                <span className="font-medium">Delivery Address:</span> {order.delivery_address}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;
