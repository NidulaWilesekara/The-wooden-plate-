import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const CreateCategory = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    is_active: true,
    sort_order: 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('admin_token');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('is_active', formData.is_active ? '1' : '0');
      submitData.append('sort_order', formData.sort_order || '0');
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const res = await fetch('http://localhost:8000/api/admin/categories', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          errorMessages.forEach((msg) => toast.error(msg));
          return;
        }
        throw new Error(data.message || 'Failed to create category');
      }

      toast.success('Category created successfully');
      navigate('/admin/categories');
    } catch (err) {
      toast.error(err.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 py-8">
        <div className="w-full md:px-8 px-4">
          {/* ✅ HERO HEADER (Full width) */}
          <div className="mb-6">
            <div className="w-full rounded-xl border border-gray-200 bg-gray-100 px-6 py-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Create Category
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Add a new category to the system
                  </p>
                </div>

                <button
                  onClick={() => navigate('/admin/categories')}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
                             bg-white hover:bg-gray-50 border border-gray-200
                             text-gray-800 text-sm font-medium transition cursor-pointer"
                >
                  ← Back to Categories
                </button>
              </div>
            </div>
          </div>

          {/* ✅ FORM CARD (Full width + bigger spacing) */}
          <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* form header inside card */}
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Category Information
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Fill required fields and click "Create".
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter category name"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Category Image
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-1 file:px-3
                                 file:rounded-md file:border-0 file:text-sm file:font-medium
                                 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {imagePreview && (
                      <div className="relative w-32 h-32">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Categories are sorted by this value in ascending order
                  </p>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col md:flex-row gap-3 pt-2 md:justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`rounded-md cursor-pointer px-4 py-2 text-sm font-medium transition ${
                    loading
                      ? 'bg-blue-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/admin/categories')}
                  className="rounded-md px-4 py-2 text-sm font-medium
                            bg-gray-100 hover:bg-gray-200 border border-gray-200
                            text-gray-800 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* bottom spacing */}
          <div className="h-6" />
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateCategory;
