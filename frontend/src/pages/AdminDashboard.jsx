import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Store, 
  Wrench, 
  FileText, 
  LogOut, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import api from '../utils/api';

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('maintenance');

  // --- STATE ---
  const [maintenanceView, setMaintenanceView] = useState('add');
  const [addForm, setAddForm] = useState({ userId: '', duration: '6 months' });
  const [updateForm, setUpdateForm] = useState({ membershipNo: '', action: 'extend' });
  const [message, setMessage] = useState(null);

  // ✅ ADD MEMBERSHIP (API INTEGRATED)
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!addForm.userId) {
      return setMessage({ type: 'error', text: 'User ID is mandatory.' });
    }

    try {
      const response = await api.post('/admin/membership', addForm);

      setMessage({
        type: 'success',
        text: `Success! Generated ID: ${response.data.membership.membershipNo}`
      });

      setAddForm({ userId: '', duration: '6 months' });
    } catch (error) {
      console.error(error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to add membership'
      });
    }
  };

  // ✅ UPDATE MEMBERSHIP (API INTEGRATED)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!updateForm.membershipNo) {
      return setMessage({ type: 'error', text: 'Membership Number is mandatory.' });
    }

    try {
      const response = await api.put(
        `/admin/membership/${updateForm.membershipNo}`,
        { action: updateForm.action }
      );

      setMessage({
        type: 'success',
        text: response.data.message
      });

      setUpdateForm({ membershipNo: '', action: 'extend' });
    } catch (error) {
      console.error(error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update membership'
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-center border-b border-slate-800">
          <h2 className="text-xl font-bold text-blue-400">Admin Portal</h2>
          <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('maintenance')} className={`w-full flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'maintenance' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <Wrench size={20}/> <span>Maintenance</span>
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <Users size={20}/> <span>Users</span>
          </button>
          <button onClick={() => setActiveTab('vendors')} className={`w-full flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'vendors' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <Store size={20}/> <span>Vendors</span>
          </button>
          <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center space-x-3 p-3 rounded-lg ${activeTab === 'reports' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <FileText size={20}/> <span>Reports</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="w-full flex justify-center items-center space-x-2 p-3 bg-red-500/10 text-red-500 rounded-lg">
            <LogOut size={20}/> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-4">{activeTab} Module</h1>

        {/* MESSAGE */}
        {message && (
          <div className={`p-4 mb-6 rounded ${message.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {message.text}
          </div>
        )}

        {/* MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <div className="bg-white p-6 rounded shadow">

            {/* TOGGLE */}
            <div className="flex mb-6">
              <button onClick={() => setMaintenanceView('add')} className={`flex-1 p-3 ${maintenanceView === 'add' ? 'bg-blue-600 text-white' : ''}`}>
                Add Membership
              </button>
              <button onClick={() => setMaintenanceView('update')} className={`flex-1 p-3 ${maintenanceView === 'update' ? 'bg-blue-600 text-white' : ''}`}>
                Update Membership
              </button>
            </div>

            {/* ADD FORM */}
            {maintenanceView === 'add' && (
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="User ID"
                  value={addForm.userId}
                  onChange={(e) => setAddForm({ ...addForm, userId: e.target.value })}
                  className="w-full p-3 border rounded"
                  required
                />

                {['6 months', '1 year', '2 years'].map(d => (
                  <label key={d} className="block">
                    <input
                      type="radio"
                      value={d}
                      checked={addForm.duration === d}
                      onChange={(e) => setAddForm({ ...addForm, duration: e.target.value })}
                    /> {d}
                  </label>
                ))}

                <button className="w-full bg-blue-600 text-white p-3 rounded">
                  Create Membership
                </button>
              </form>
            )}

            {/* UPDATE FORM */}
            {maintenanceView === 'update' && (
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Membership No"
                  value={updateForm.membershipNo}
                  onChange={(e) => setUpdateForm({ ...updateForm, membershipNo: e.target.value })}
                  className="w-full p-3 border rounded"
                  required
                />

                <label>
                  <input
                    type="radio"
                    value="extend"
                    checked={updateForm.action === 'extend'}
                    onChange={(e) => setUpdateForm({ ...updateForm, action: e.target.value })}
                  /> Extend
                </label>

                <label>
                  <input
                    type="radio"
                    value="cancel"
                    checked={updateForm.action === 'cancel'}
                    onChange={(e) => setUpdateForm({ ...updateForm, action: e.target.value })}
                  /> Cancel
                </label>

                <button className="w-full bg-green-600 text-white p-3 rounded">
                  Submit
                </button>
              </form>
            )}

          </div>
        )}
      </main>
    </div>
  );
}