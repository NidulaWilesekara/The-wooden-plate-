import React from 'react';
import CustomerLayout from '../components/CustomerLayout';

const AboutPage = () => {
  return (
    <CustomerLayout>
      <div className="bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl text-amber-100">
              Discover our story and passion for great food
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                The Wooden Plate was born from a simple idea: to create a place where people can enjoy
                delicious, authentic food in a warm and welcoming atmosphere. Since our opening, we've
                been committed to serving high-quality meals made with fresh, locally-sourced ingredients.
              </p>
              <p className="mb-4">
                Our journey started with a passion for cooking and a dream to share that passion with our
                community. Today, we're proud to be your neighborhood restaurant, serving everything from
                traditional favorites to innovative new dishes.
              </p>
              <p>
                Every dish we serve is prepared with care, attention to detail, and a genuine love for
                what we do. We believe that great food brings people together, and we're honored to be
                part of your special moments.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-amber-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-8 shadow-md">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Quality First</h3>
                <p className="text-gray-600">
                  We never compromise on quality. From ingredient selection to final presentation,
                  excellence is our standard.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-md">
                <div className="text-4xl mb-4">❤️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Made with Love</h3>
                <p className="text-gray-600">
                  Every dish is prepared with genuine care and passion. We treat each order as if
                  we're cooking for family.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-md">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Community Focused</h3>
                <p className="text-gray-600">
                  We're proud to support local suppliers and give back to the community that
                  supports us.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-md">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Customer Delight</h3>
                <p className="text-gray-600">
                  Your satisfaction is our success. We go the extra mile to ensure you have a
                  wonderful experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Visit Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📍 Location</h3>
                <p className="text-gray-700 mb-2">123 Main Street</p>
                <p className="text-gray-700 mb-2">Colombo, Sri Lanka</p>
                <p className="text-gray-600 text-sm mt-4">Easy parking available</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🕐 Opening Hours</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Monday - Friday:</strong> 10:00 AM - 10:00 PM</p>
                  <p><strong>Saturday - Sunday:</strong> 9:00 AM - 11:00 PM</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📞 Contact</h3>
                <p className="text-gray-700 mb-2">Phone: +94 77 123 4567</p>
                <p className="text-gray-700 mb-2">Email: info@thewoodenplate.lk</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🌐 Follow Us</h3>
                <p className="text-gray-700 mb-2">Facebook: @thewoodenplate</p>
                <p className="text-gray-700 mb-2">Instagram: @thewoodenplate_lk</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </CustomerLayout>
  );
};

export default AboutPage;
