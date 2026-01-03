import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`http://localhost:8000/api/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch product");

      const data = await res.json();
      setProduct(data.data);
    } catch (err) {
      toast.error("Failed to load product");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading product...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center text-red-600">Product not found</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Product Details</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/admin/products/edit/${product.id}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Edit Product
            </button>
            <button
              onClick={() => navigate("/admin/products")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Products
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Product Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Product Name</label>
                <p className="text-lg font-semibold text-gray-900">{product.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Price</label>
                <p className="text-2xl font-bold text-green-600">
                  ${parseFloat(product.price).toFixed(2)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Category</label>
                <p className="text-gray-900">{product.category || "N/A"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900 bg-gray-50 p-4 rounded border-l-4 border-blue-500">
                  {product.description || "No description available"}
                </p>
              </div>

              {product.image && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Image</label>
                  <div className="mt-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full max-w-md h-64 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status & Meta */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Status</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Availability</label>
                  <div className="mt-2">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        product.is_available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.is_available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Product Badges
                  </label>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Featured</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.is_featured
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.is_featured ? "Yes" : "No"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">New Product</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.is_new
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {product.is_new ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Meta Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Additional Info
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Product ID:</span>
                  <span className="font-semibold">#{product.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-semibold">
                    {new Date(product.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-semibold">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewProduct;
