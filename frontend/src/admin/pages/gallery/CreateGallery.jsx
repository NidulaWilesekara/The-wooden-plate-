import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const CreateGallery = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    is_active: true,
    sort_order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'food', label: 'Food' },
    { value: 'ambiance', label: 'Ambiance' },
    { value: 'events', label: 'Events' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
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

    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('category', formData.category);
      formDataToSend.append('is_active', formData.is_active ? '1' : '0');
      formDataToSend.append('sort_order', formData.sort_order);
      formDataToSend.append('image', imageFile);

      const res = await fetch('http://localhost:8000/api/admin/gallery', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create gallery image');
      }

      toast.success('Gallery image created successfully');
      navigate('/admin/gallery');
    } catch (error) {
      toast.error(error.message || 'Failed to create gallery image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 py-8">
        <div className="w-full md:px-8 px-4">
          {/* Header */}
          <div className="mb-6">
            <div className="bg-gray-100 border border-gray-200 rounded-xl px-6 py-5 shadow-sm">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/admin/gallery')}
                  className="p-2 rounded-lg hover:bg-gray-200 transition"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Add Gallery Image
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Upload a new image to your gallery
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image <span className="text-red-500">*</span>
                </label>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-40 h-32 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-40 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      PNG, JPG, GIF, WEBP up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter image title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter image description (optional)"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Lower numbers appear first
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active (visible on customer gallery)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Creating...' : 'Create Image'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/gallery')}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateGallery;
