import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    is_active: true,
    sort_order: 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:8000/api/admin/categories/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error('Failed to fetch category');

        const result = await res.json();
        const data = result.data || result;

        setFormData({
          name: data?.name ?? '',
          is_active: data?.is_active ?? true,
          sort_order: data?.sort_order ?? 0,
        });
        if (data?.image) {
          setExistingImage(data.image);
        }
      } catch (e) {
        toast.error('Failed to load category');
        navigate('/admin/categories');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id, navigate, token]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;
    setShowConfirm(true);
  };

  const handleConfirmUpdate = async () => {
    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('is_active', formData.is_active ? '1' : '0');
      submitData.append('sort_order', formData.sort_order || '0');
      submitData.append('_method', 'PUT');
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const res = await fetch(
        `http://localhost:8000/api/admin/categories/${id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: submitData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          errorMessages.forEach((msg) => toast.error(msg));
          return;
        }
        throw new Error(data.message || 'Failed to update category');
      }

      toast.success('Category updated successfully');
      navigate('/admin/categories');
    } catch (e2) {
      toast.error(e2.message || 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full">
        {/* ✅ HEADER (match View page style) */}
        <div className="mb-6">
          <div className="w-full rounded-xl border border-gray-200 bg-gray-100 px-6 py-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Edit Category
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Update category information
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

        {/* ✅ CONTENT */}
        {loading ? (
          <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm p-6 text-gray-600">
            Loading category...
          </div>
        ) : (
          <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* TOP BAR (like view card top) */}
            <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-semibold text-gray-900">
                  Update Details
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Change fields and click "Update Category"
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/categories/${id}`)}
                  className="px-5 py-2.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200
                             text-gray-800 text-sm font-medium transition cursor-pointer"
                >
                  View
                </button>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-gray-500">
                    Category Name <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    placeholder="Enter category name"
                  />
                </div>

                {/* Image Upload */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-gray-500">Category Image</p>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition
                                 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0
                                 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {(imagePreview || existingImage) && (
                      <div className="relative w-32 h-32">
                        <img
                          src={imagePreview || (existingImage?.startsWith('http') ? existingImage : `http://localhost:8000/storage/${existingImage}`)}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            setExistingImage(null);
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
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-gray-500">Sort Order</p>
                  <input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleChange}
                    min="0"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500">
                    Categories are sorted by this value in ascending order
                  </p>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-800">
                    Active
                  </label>
                </div>
              </div>

              {/* ACTION BUTTONS (same vibe as View) */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 md:justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`rounded-md cursor-pointer px-4 py-2 text-sm font-medium transition ${
                    submitting
                      ? 'bg-blue-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {submitting ? 'Updating...' : 'Update Category'}
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
        )}
      </div>

      {/* Confirm Update Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmUpdate}
        title="Update Category"
        message="Are you sure you want to update this category?"
        confirmText="Update"
        cancelText="Cancel"
        type="warning"
      />
    </AdminLayout>
  );
};

export default EditCategory;
