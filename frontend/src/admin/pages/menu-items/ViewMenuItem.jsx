import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────────────────
   Field – simple read‑only row (label + value)
───────────────────────────────────────────────────────── */
const Field = ({ label, children }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-4 border-b border-gray-100 last:border-b-0">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="md:col-span-2 text-sm text-gray-900">{children ?? '—'}</dd>
  </div>
);

const ViewMenuItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/admin/menu-items/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch menu item');

        const data = await res.json();
        setMenuItem(data.data);
      } catch (e) {
        toast.error('Failed to fetch menu item');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id, token]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="text-gray-400 animate-pulse">Loading...</span>
        </div>
      </AdminLayout>
    );
  }

  if (!menuItem) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="text-gray-400">Menu item not found</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex-1 py-8">
        <div className="w-full md:px-8 px-4">
          {/* ✅ HERO HEADER */}
          <div className="mb-6">
            <div className="w-full rounded-xl border border-gray-200 bg-gray-100 px-6 py-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Menu Item Details
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Viewing information for <span className="font-medium">{menuItem.name}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate('/admin/menu-items')}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
                               bg-white hover:bg-gray-50 border border-gray-200
                               text-gray-800 text-sm font-medium transition cursor-pointer"
                  >
                    ← Back to List
                  </button>

                  <button
                    onClick={() => navigate(`/admin/menu-items/${id}/edit`)}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg
                               bg-blue-600 hover:bg-blue-700
                               text-white text-sm font-medium transition cursor-pointer"
                  >
                    Edit Menu Item
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ DETAILS CARD */}
          <div className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* card header */}
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu Item Information</h2>
              <p className="text-sm text-gray-500 mt-1">Full details of the menu item.</p>
            </div>

            {/* body */}
            <div className="px-6 py-4">
              <dl className="divide-y divide-gray-100">
                <Field label="ID">{menuItem.id}</Field>
                <Field label="Category">{menuItem.category?.name}</Field>
                <Field label="Name">{menuItem.name}</Field>
                <Field label="Price">Rs. {parseFloat(menuItem.price).toFixed(2)}</Field>
                <Field label="Description">{menuItem.description}</Field>
                <Field label="Image">
                  {menuItem.image ? (
                    <img
                      src={menuItem.image}
                      alt={menuItem.name}
                      className="h-24 w-24 object-cover rounded-lg"
                    />
                  ) : (
                    '—'
                  )}
                </Field>
                <Field label="Status">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      menuItem.is_available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {menuItem.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </Field>
                <Field label="Created At">
                  {new Date(menuItem.created_at).toLocaleString()}
                </Field>
                <Field label="Updated At">
                  {new Date(menuItem.updated_at).toLocaleString()}
                </Field>
              </dl>
            </div>
          </div>

          {/* bottom spacing */}
          <div className="h-6" />
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewMenuItem;
