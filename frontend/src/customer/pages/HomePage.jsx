import React from 'react';
import { Link } from 'react-router-dom';
import CustomerLayout from '../components/CustomerLayout';

const HomePage = () => {
  return (
    <CustomerLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to The Wooden Plate
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-amber-100">
              Experience authentic flavors crafted with passion
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/menu"
                className="bg-white text-amber-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
              >
                View Menu
              </Link>
              <Link
                to="/about"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-amber-600 transition"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600">Quality food, great service, memorable experiences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🍳</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600">
                We use only the freshest, locally-sourced ingredients in all our dishes
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">👨‍🍳</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Expert Chefs</h3>
              <p className="text-gray-600">
                Our experienced chefs bring years of culinary expertise to every plate
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Fast Service</h3>
              <p className="text-gray-600">
                Quick preparation and delivery without compromising on quality
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Order?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Browse our menu and place your order in minutes
          </p>
          <Link
            to="/menu"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-12 py-4 rounded-lg font-bold text-lg transition"
          >
            Order Now →
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dine-In</h3>
              <p className="text-gray-600">Enjoy your meal in our cozy restaurant atmosphere</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🥡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Takeaway</h3>
              <p className="text-gray-600">Pick up your order and enjoy it anywhere you like</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delivery</h3>
              <p className="text-gray-600">We'll bring your favorite dishes right to your door</p>
            </div>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
};

export default HomePage;
