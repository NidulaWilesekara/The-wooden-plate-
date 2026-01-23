import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';

const GalleryList = () => {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // delete modal
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const token = localStorage.getItem('admin_token');

  const fetchImages = async () => {
    try {
      setLoading(true);

      const res = await fetch('http://localhost:8000/api/admin/gallery', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch gallery images');

      const data = await res.json();
      setImages(data.data || []);
    } catch (e) {
      toast.error('Failed to load gallery images');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('http://localhost:8000/api/admin/gallery', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!res.ok) throw new Error('Failed to upload image');
      }

      toast.success(`${files.length} image(s) uploaded successfully`);
      fetchImages();
    } catch (error) {
      toast.error('Failed to upload image(s)');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteModal.id;
    if (!id) return;

    try {
      const res = await fetch(`http://localhost:8000/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to delete image');

      toast.success('Image deleted successfully');
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (e) {
      toast.error('Failed to delete image');
    }
  };

  const toggleActive = async (item) => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/gallery/${item.id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to update status');

      toast.success(item.is_active ? 'Image hidden from gallery' : 'Image visible in gallery');
      fetchImages();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  // pagination derived values
  const totalPages = useMemo(
    () => Math.ceil(images.length / itemsPerPage) || 1,
    [images.length, itemsPerPage]
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedImages = images.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  return (
    <AdminLayout>
      <div className="flex-1 py-8">
        <div className="w-full md:px-8 px-4">
          {/* Header card */}
          <div className="mb-6">
            <div className="bg-gray-100 border border-gray-200 rounded-xl px-6 py-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Gallery
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage your gallery images ({images.length} total)
                  </p>
                </div>

                <label className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition cursor-pointer">
                  {uploading ? 'Uploading...' : '+ Upload Images'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            {loading ? (
              <div className="text-center py-12 text-gray-600">Loading gallery images...</div>
            ) : images.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-4 text-gray-900 font-semibold">No gallery images yet</p>
                <p className="text-sm text-gray-500 mt-1">Upload your first image to get started</p>
                <label className="mt-4 inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer">
                  + Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {paginatedImages.map((img) => (
                    <div
                      key={img.id}
                      className={`relative group rounded-xl overflow-hidden border-2 ${
                        img.is_active ? 'border-green-400' : 'border-gray-300'
                      }`}
                    >
                      <img
                        src={`http://localhost:8000${img.image}`}
                        alt={`Gallery ${img.id}`}
                        className="w-full h-40 object-cover"
                      />
                      
                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                        {/* Toggle Active */}
                        <button
                          onClick={() => toggleActive(img)}
                          className={`p-2 rounded-full ${
                            img.is_active 
                              ? 'bg-green-500 hover:bg-green-600' 
                              : 'bg-gray-500 hover:bg-gray-600'
                          } text-white transition`}
                          title={img.is_active ? 'Hide from gallery' : 'Show in gallery'}
                        >
                          {img.is_active ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteClick(img.id)}
                          className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition"
                          title="Delete image"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Status badge */}
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                        img.is_active 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }`}>
                        {img.is_active ? 'Active' : 'Hidden'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Previous
                    </button>

                    <span className="px-3 py-2 text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </AdminLayout>
  );
};

export default GalleryList;
