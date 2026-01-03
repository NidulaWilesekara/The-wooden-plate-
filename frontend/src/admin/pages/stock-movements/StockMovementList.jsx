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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stock Movements</h1>
            <p className="text-gray-600 mt-1">Log stock IN (purchases) and OUT (usage/waste)</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/inventory"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              📊 View Dashboard
            </Link>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              {showForm ? "✕ Cancel" : "+ Log Movement"}
            </button>
          </div>
        </div>

        {/* Log Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Supplier invoice #123, Kitchen usage, Spoilage"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? "Recording..." : "Record Movement"}
              </button>
            </form>
          </div>
        )}

        {/* Movements Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Recent Movements</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingredient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movements.map((movement) => (
                  <tr key={movement.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(movement.movement_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {movement.ingredient?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          movement.type === "IN"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {movement.type === "IN" ? "📥 IN" : "📤 OUT"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span
                        className={`text-sm font-bold ${
                          movement.type === "IN" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {movement.type === "IN" ? "+" : "-"}
                        {movement.quantity} {movement.ingredient?.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {movement.note || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleDelete(movement.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
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
