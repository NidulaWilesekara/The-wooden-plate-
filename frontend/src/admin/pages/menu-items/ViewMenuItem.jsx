import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import toast from 'react-hot-toast';

const ViewMenuItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItem();
  }, [id]);

  const fetchMenuItem = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:8000/api/admin/menu-items/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setMenuItem(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:8000/api/admin/menu-items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        navigate('/admin/menu-items');
      }
    } catch (error) {
      toast.error('Failed to delete menu item');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!menuItem) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Menu item not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Menu Item Details</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/menu-items/${id}/edit`)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => navigate('/admin/menu-items')}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {menuItem.image && (
            <div className="h-64 bg-gray-200">
              <img
                src={menuItem.image}
                alt={menuItem.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{menuItem.name}</h2>
                <p className="text-gray-500 mt-1">Item ID: {menuItem.id}</p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  menuItem.is_available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {menuItem.is_available ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-lg font-semibold text-gray-900">
                  {menuItem.category?.name || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="text-lg font-semibold text-gray-900">
                  Rs. {parseFloat(menuItem.price).toFixed(2)}
                </p>
              </div>
            </div>

            {menuItem.description && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-gray-900">{menuItem.description}</p>
              </div>
            )}

            <div className="pt-4 border-t text-sm text-gray-500">
              <p>Created: {new Date(menuItem.created_at).toLocaleString()}</p>
              <p>Last Updated: {new Date(menuItem.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewMenuItem;
