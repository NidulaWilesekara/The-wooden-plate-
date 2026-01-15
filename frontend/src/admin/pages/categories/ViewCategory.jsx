import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const ViewCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

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

        setCategory(data);
      } catch (e) {
        toast.error('Failed to load category');
        navigate('/admin/categories');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id, navigate, token]);

  const Field = ({ label, value }) => (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900">
        {value || '—'}
      </div>
    </div>
  );

  return (
    <AdminLayout>
      {/* FULL WIDTH WRAPPER */}
      <div className="w-full">
        {/* ✅ HEADER (full width inside content area) */}
        <div className="mb-6">
          <div className="w-full rounded-xl border border-gray-200 bg-gray-100 px-6 py-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Category Details
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                View category information
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
        ) : !category ? null : (
          <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* TOP BAR */}
            <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center gap-4">
              {/* Image */}
              {category.image && (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}

              {/* title section */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-semibold text-gray-900">
                  {category.name || 'Unnamed Category'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Category ID: {category.id}
                </p>

                <div className="mt-2 flex items-center justify-center md:justify-start gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      category.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {category.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition cursor-pointer"
                >
                  Edit Category
                </button>
              </div>
            </div>

            {/* DETAILS GRID (label = value style) */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Name" value={category.name} />
                <Field label="Sort Order" value={category.sort_order} />
                <Field label="Status" value={category.is_active ? 'Active' : 'Inactive'} />
                <Field label="Menu Items" value={`${category.menu_items?.length || 0} items`} />

                {category.created_at && (
                  <Field
                    label="Created At"
                    value={new Date(category.created_at).toLocaleString()}
                  />
                )}

                {category.updated_at && (
                  <Field
                    label="Updated At"
                    value={new Date(category.updated_at).toLocaleString()}
                  />
                )}
              </div>

              {/* Menu Items List */}
              {category.menu_items && category.menu_items.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Items</h3>
                  <div className="space-y-2">
                    {category.menu_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Rs. {item.price}</p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.is_available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ViewCategory;
