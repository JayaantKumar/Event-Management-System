import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Package, PlusCircle, Activity, LogOut, Trash2 } from 'lucide-react';

export default function VendorDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('items');

  const [items, setItems] = useState([]);
  const [addForm, setAddForm] = useState({ name: '', price: '' });
  const [message, setMessage] = useState(null);

  // ✅ 1. DEFINE FUNCTION FIRST (FIXED)
  const fetchItems = async () => {
    try {
      const { data } = await api.get('/vendor/items');
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch items", error);
    }
  };

  // ✅ 2. THEN USE IT
  useEffect(() => {
    if (activeTab === 'items') {
      fetchItems();
    }
  }, [activeTab]);

  // ✅ ADD ITEM
  const handleAddItem = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      await api.post('/vendor/items', addForm);

      setMessage({ type: 'success', text: 'Product added successfully!' });
      setAddForm({ name: '', price: '' });

      // 🔥 refresh list
      setActiveTab('items');
      fetchItems();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to add item'
      });
    }
  };

  // ✅ DELETE ITEM
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await api.delete(`/vendor/items/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      alert("Failed to delete item");
    }
  };

  // ✅ TOGGLE STATUS
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Available' ? 'Out of Stock' : 'Available';

    try {
      const { data } = await api.put(`/vendor/items/${id}/status`, {
        status: newStatus
      });

      setItems(items.map(item =>
        item._id === id ? data.product : item
      ));
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-teal-900 text-white flex flex-col">
        <div className="p-6 text-center border-b border-teal-800">
          <h2 className="text-xl font-bold text-teal-300">Vendor Portal</h2>
          <p className="text-xs text-teal-100 mt-1">{user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => { setActiveTab('items'); setMessage(null); }}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'items' ? 'bg-teal-700' : 'hover:bg-teal-800'}`}
          >
            <Package size={20}/> <span>Your Items</span>
          </button>

          <button
            onClick={() => { setActiveTab('add'); setMessage(null); }}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'add' ? 'bg-teal-700' : 'hover:bg-teal-800'}`}
          >
            <PlusCircle size={20}/> <span>Add Item</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'transactions' ? 'bg-teal-700' : 'hover:bg-teal-800'}`}
          >
            <Activity size={20}/> <span>Transactions</span>
          </button>
        </nav>

        <div className="p-4 border-t border-teal-800">
          <button onClick={logout} className="w-full flex justify-center p-3 bg-red-500/10 text-red-400 rounded">
            <LogOut size={20}/> Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {activeTab === 'add' ? 'Add Product' : activeTab}
        </h1>

        {message && (
          <div className={`p-4 mb-6 rounded ${message.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {message.text}
          </div>
        )}

        {/* ITEMS */}
        {activeTab === 'items' && (
          <table className="w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan="4" className="text-center p-6">No items</td></tr>
              ) : (
                items.map(item => (
                  <tr key={item._id}>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">${item.price}</td>
                    <td className="p-3">{item.status}</td>
                    <td className="p-3 space-x-2">
                      <button onClick={() => handleToggleStatus(item._id, item.status)} className="bg-blue-500 text-white px-2 py-1 rounded">
                        Toggle
                      </button>
                      <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* ADD ITEM */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddItem} className="bg-white p-6 rounded shadow max-w-md space-y-4">
            <input
              type="text"
              placeholder="Product Name"
              required
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              className="w-full p-3 border rounded"
            />

            <input
              type="number"
              placeholder="Price"
              required
              value={addForm.price}
              onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
              className="w-full p-3 border rounded"
            />

            <button className="w-full bg-teal-600 text-white p-3 rounded">
              Add Item
            </button>
          </form>
        )}
      </main>
    </div>
  );
}