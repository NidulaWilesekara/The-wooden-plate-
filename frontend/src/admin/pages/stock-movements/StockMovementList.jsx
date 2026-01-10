import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import toast from "react-hot-toast";

const StockMovementList = () => {
  const [movements, setMovements] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ingredient_id: "",
    type: "IN",
    quantity: "",
    movement_date: new Date().toISOString().split("T")[0],
    note: "",
  });

  useEffect(() => {
    fetchMovements();
    fetchIngredients();
  }, []);

  const fetchMovements = async () => {
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch("http://localhost:8000/api/admin/stock-movements", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setMovements(result.data);
      }
    } catch (error) {
      toast.error("Error fetching movements");
    }
  };

  const fetchIngredients = async () => {
    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch("http://localhost:8000/api/admin/ingredients?is_active=1", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setIngredients(result.data);
      }
    } catch (error) {
      toast.error("Error fetching ingredients");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch("http://localhost:8000/api/admin/stock-movements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Stock movement recorded successfully");
        setShowForm(false);
        setFormData({
          ingredient_id: "",
          type: "IN",
          quantity: "",
          movement_date: new Date().toISOString().split("T")[0],
          note: "",
        });
        fetchMovements();
        fetchIngredients(); // Refresh to get updated stock levels
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to record movement");
      }
    } catch (error) {
      toast.error("Error recording movement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this movement? Stock will be reversed.")) return;

    const token = localStorage.getItem("admin_token");
    try {
      const response = await fetch(`http://localhost:8000/api/admin/stock-movements/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        toast.success("Movement deleted and stock reversed");
        fetchMovements();
        fetchIngredients();
      } else {
        toast.error("Failed to delete movement");
      }
    } catch (error) {
      toast.error("Error deleting movement");
    }
  };

  return (
    <AdminLayout>
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Stock Movements
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Log stock IN (purchases) and OUT (usage/waste)
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/admin/inventory"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium shadow-sm"
            >
              📊 View Dashboard
            </Link>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm"
            >
              {showForm ? "✕ Cancel" : "+ Log Movement"}
            </button>
          </div>
        </div>

        {/* Log Form */}
        {showForm && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Record Stock Movement</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingredient *
                  </label>
                  <select
                    name="ingredient_id"
                    value={formData.ingredient_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Ingredient</option>
                    {ingredients.map((ing) => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name} ({ing.current_stock} {ing.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Movement Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="IN">📥 Stock IN (Purchase/Receive)</option>
                    <option value="OUT">📤 Stock OUT (Usage/Waste)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0.01"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="movement_date"
                    value={formData.movement_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Supplier invoice #123, Kitchen usage, Spoilage"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm disabled:opacity-50"
              >
                {loading ? "Recording..." : "Record Movement"}
              </button>
            </form>
          </div>
        )}

        {/* Movements Table */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Top Bar */}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">
              Recent Movements
              <span className="text-gray-400 font-normal"> ({movements.length})</span>
            </p>

            <button
              onClick={fetchMovements}
              className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 text-sm text-gray-700"
            >
              Refresh
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="min-w-[900px] w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Ingredient</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Quantity</th>
                  <th className="px-5 py-3">Note</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {movements.map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm text-gray-900">
                      {new Date(movement.movement_date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                      {movement.ingredient?.name}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          movement.type === "IN"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {movement.type === "IN" ? "📥 IN" : "📤 OUT"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-sm font-bold ${
                          movement.type === "IN" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {movement.type === "IN" ? "+" : "-"}
                        {movement.quantity} {movement.ingredient?.unit}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {movement.note || "-"}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDelete(movement.id)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default StockMovementList;
