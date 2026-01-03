import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout';
import toast from 'react-hot-toast';

const OrderTrackingPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/public/orders/${orderNumber}`);
      if (response.ok) {
        const result = await response.json();
        setOrder(result.data);
      } else {
        toast.error('Order not found');
      }
    } catch (error) {
      toast.error('Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'preparing', 'ready', 'completed'];
    return steps.indexOf(status) + 1;
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-4 py-2 rounded-full font-semibold uppercase text-sm ${colors[status]}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-xl text-gray-600">Loading order details...</div>
        </div>
      </CustomerLayout>
    );
  }

  if (!order) {
    return (
      <CustomerLayout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-8">
            We couldn't find an order with number: {orderNumber}
          </p>
          <Link
            to="/menu"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition"
          >
            Back to Menu
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  const currentStep = getStatusStep(order.status);

  return (
    <CustomerLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-4">Thank you for your order, {order.customer_name}</p>
            <div className="text-2xl font-bold text-amber-600 mb-2">
              Order #{order.order_number}
            </div>
            <StatusBadge status={order.status} />
            <p className="text-gray-600 mt-4">
              Estimated time: <span className="font-semibold">{order.estimated_time}</span>
            </p>
          </div>

          {/* Order Status Timeline */}
          {order.status !== 'cancelled' && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
              
              <div className="relative">
                {/* Progress Bar */}
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-200">
                  <div
                    className="h-full bg-amber-600 transition-all duration-500"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  />
                </div>

                {/* Status Steps */}
                <div className="relative flex justify-between">
                  {/* Pending */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 1 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      1
                    </div>
                    <span className="text-sm font-medium text-gray-700 mt-2">Pending</span>
                  </div>

                  {/* Preparing */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      2
                    </div>
                    <span className="text-sm font-medium text-gray-700 mt-2">Preparing</span>
                  </div>

                  {/* Ready */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 3 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      3
                    </div>
                    <span className="text-sm font-medium text-gray-700 mt-2">Ready</span>
                  </div>

                  {/* Completed */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 4 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      4
                    </div>
                    <span className="text-sm font-medium text-gray-700 mt-2">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Type:</span>
                <span className="font-semibold capitalize">{order.order_type}</span>
              </div>
              {order.order_type === 'delivery' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Address:</span>
                  <span className="font-semibold text-right max-w-xs">-</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Contact:</span>
                <span className="font-semibold">{order.customer_phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Time:</span>
                <span className="font-semibold">{new Date(order.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-bold text-gray-900 mb-4">Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold">Rs. {item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t mt-6 pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>Rs. {order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- Rs. {order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span className="text-amber-600">Rs. {order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="text-center space-y-4">
            <button
              onClick={fetchOrder}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              🔄 Refresh Status
            </button>
            <div>
              <Link
                to="/menu"
                className="inline-block text-amber-600 hover:text-amber-700 font-medium"
              >
                ← Order Again
              </Link>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default OrderTrackingPage;
