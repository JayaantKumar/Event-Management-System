import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Package, PlusCircle, Activity, LogOut, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export default function VendorDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('items'); 
  
  const [items, setItems] = useState([]);
  const [addForm, setAddForm] = useState({ name: '', price: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (activeTab === 'items') fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/vendor/items');
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch items", error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.post('/vendor/items', addForm);
      setMessage({ type: 'success', text: 'Product added successfully!' });
      setAddForm({ name: '', price: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add item' });
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/vendor/items/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      alert("Failed to delete item");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Available' ? 'Out of Stock' : 'Available';
    try {
      const { data } = await api.put(`/vendor/items/${id}/status`, { status: newStatus });
      setItems(items.map(item => item._id === id ? data.product : item));
    } catch (error) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      
      {/* SIDEBAR: Deep Forest Green */}
      <aside className="w-64 bg-[#022c22] text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-[#064e3b]">
          <h2 className="text-xl font-bold text-[#f59e0b]">Vendor Hub</h2>
          <p className="text-xs text-[#a7f3d0] mt-1">{user?.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {['items', 'add', 'transactions'].map((tab) => (
            <button 
              key={tab}
              onClick={() => {setActiveTab(tab); setMessage(null);}}
              className={`w-full flex items-center space-x-3 p-3 rounded-md transition capitalize font-medium
                ${activeTab === tab 
                  ? 'bg-[#064e3b] text-[#f59e0b] border-l-4 border-[#f59e0b]' 
                  : 'text-[#d1fae5] hover:bg-[#064e3b] hover:text-white border-l-4 border-transparent'}`}
            >
              {tab === 'items' && <Package size={20} />}
              {tab === 'add' && <PlusCircle size={20} />}
              {tab === 'transactions' && <Activity size={20} />}
              <span>{tab === 'items' ? 'Your Inventory' : tab === 'add' ? 'Add Product' : tab}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#064e3b]">
          <button onClick={logout} className="w-full flex items-center justify-center space-x-2 p-3 bg-red-900/40 text-red-300 rounded-md hover:bg-red-800/60 transition">
            <LogOut size={20} /> <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-[#064e3b] capitalize tracking-tight">
            {activeTab === 'add' ? 'Add New Product' : activeTab === 'items' ? 'Inventory Management' : activeTab}
          </h1>
        </header>

        {message && (
          <div className={`p-4 mb-8 rounded-md flex items-center space-x-3 font-medium border ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
            {message.type === 'error' ? <AlertCircle size={20}/> : <CheckCircle size={20}/>}
            <span>{message.text}</span>
          </div>
        )}

        {/* YOUR ITEMS TAB */}
        {activeTab === 'items' && (
          <div className="bg-white rounded-lg shadow-md border border-[#e2e8f0] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f1f5f9] border-b border-[#cbd5e1] text-[#334155]">
                  <th className="p-5 font-bold uppercase text-xs tracking-wider">Product Name</th>
                  <th className="p-5 font-bold uppercase text-xs tracking-wider">Price</th>
                  <th className="p-5 font-bold uppercase text-xs tracking-wider">Status</th>
                  <th className="p-5 font-bold uppercase text-xs tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {items.length === 0 ? (
                  <tr><td colSpan="4" className="p-10 text-center text-gray-400 italic">No inventory found. Time to add some products!</td></tr>
                ) : (
                  items.map(item => (
                    <tr key={item._id} className="hover:bg-[#f8fafc] transition">
                      <td className="p-5 font-semibold text-[#0f172a]">{item.name}</td>
                      <td className="p-5 text-[#064e3b] font-bold">${item.price.toFixed(2)}</td>
                      <td className="p-5">
                        <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${item.status === 'Available' ? 'bg-[#d1fae5] text-[#065f46] border border-[#34d399]' : 'bg-[#fef3c7] text-[#92400e] border border-[#fbbf24]'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-5 text-right space-x-3">
                        <button onClick={() => handleToggleStatus(item._id, item.status)} className="px-4 py-1.5 bg-[#f1f5f9] text-[#475569] rounded hover:bg-[#e2e8f0] text-sm font-bold transition border border-[#cbd5e1]">
                          Toggle
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition inline-flex align-middle border border-red-200">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ADD ITEM TAB */}
        {activeTab === 'add' && (
          <div className="bg-white p-8 rounded-lg shadow-md border border-[#e2e8f0] max-w-lg">
            <form onSubmit={handleAddItem} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#334155] mb-2">Product Name *</label>
                <input type="text" required className="w-full p-3.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-md focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent outline-none transition" value={addForm.name} onChange={(e) => setAddForm({...addForm, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#334155] mb-2">Price ($) *</label>
                <input type="number" min="0" step="0.01" required className="w-full p-3.5 bg-[#f8fafc] border border-[#cbd5e1] rounded-md focus:ring-2 focus:ring-[#f59e0b] focus:border-transparent outline-none transition" value={addForm.price} onChange={(e) => setAddForm({...addForm, price: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-[#064e3b] text-[#f59e0b] font-bold p-3.5 rounded-md hover:bg-[#047857] transition shadow-md">
                Publish Product
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}