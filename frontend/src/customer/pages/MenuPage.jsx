import React, { useState, useEffect } from 'react';
import CustomerLayout from '../components/CustomerLayout';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const MenuPage = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (selectedCategory !== 'all') {
      fetchMenuItems(selectedCategory);
    } else {
      fetchMenuItems();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/public/categories');
      if (response.ok) {
        const result = await response.json();
        setCategories(result.data);
      }
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const fetchMenuItems = async (categoryId = null) => {
    setLoading(true);
    try {
      const url = categoryId
        ? `http://localhost:8000/api/public/menu-items?category_id=${categoryId}`
        : 'http://localhost:8000/api/public/menu-items';
      
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        setMenuItems(result.data);
      }
    } catch (error) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      category: item.category?.name || 'Unknown',
    });
  };

  return (
    <CustomerLayout>
      <div className="bg-white min-h-screen">
        {/* Header */}
        <section className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-4">Our Menu</h1>
            <p className="text-xl text-amber-100">
              Explore our delicious selection of dishes
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-3 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition ${
                  selectedCategory === 'all'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Items
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition ${
                    selectedCategory === category.id
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Items Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-xl text-gray-600">Loading menu...</div>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-xl text-gray-600">No items found in this category</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {/* Item Image Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                      <span className="text-6xl">🍽️</span>
                    </div>

                    {/* Item Details */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                        <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded">
                          {item.category?.name}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-amber-600">
                          Rs. {parseFloat(item.price).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </CustomerLayout>
  );
};

export default MenuPage;
