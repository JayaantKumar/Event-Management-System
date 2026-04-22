import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Users, Store, Wrench, FileText, LogOut, CheckCircle, AlertCircle 
} from 'lucide-react';

export default function AdminDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('maintenance');

  // Maintenance State
  const [maintenanceView, setMaintenanceView] = useState('add');
  const [addForm, setAddForm] = useState({ userId: '', duration: '6 months' });
  const [updateForm, setUpdateForm] = useState({ membershipNo: '', action: 'extend' });
  const [message, setMessage] = useState(null);

  // Data States for new tabs
  const [usersList, setUsersList] = useState([]);
  const [vendorsList, setVendorsList] = useState([]);
  const [reportsList, setReportsList] = useState([]);

  // Fetch data dynamically based on active tab
  useEffect(() => {
    setMessage(null);
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'vendors') fetchVendors();
    if (activeTab === 'reports') fetchReports();
  }, [activeTab]);

  const fetchUsers = async () => {
    try { const { data } = await api.get('/admin/users'); setUsersList(data); } catch (e) { console.error(e); }
  };
  const fetchVendors = async () => {
    try { const { data } = await api.get('/admin/vendors'); setVendorsList(data); } catch (e) { console.error(e); }
  };
  const fetchReports = async () => {
    try { const { data } = await api.get('/admin/reports'); setReportsList(data); } catch (e) { console.error(e); }
  };

  // Maintenance Submit Handlers
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const response = await api.post('/admin/membership', addForm);
      setMessage({ type: 'success', text: `Success! Generated ID: ${response.data.membership.membershipNo}` });
      setAddForm({ userId: '', duration: '6 months' }); 
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add membership' });
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const response = await api.put(`/admin/membership/${updateForm.membershipNo}`, { action: updateForm.action });
      setMessage({ type: 'success', text: response.data.message });
      setUpdateForm({ membershipNo: '', action: 'extend' }); 
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update membership' });
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0f1e]"> 
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#020617] text-white flex flex-col"> 
        <div className="p-6 border-b border-[#1e293b]">
          <h2 className="text-xl font-bold text-[#22d3ee]">EMS Admin</h2> 
          <p className="text-xs text-[#94a3b8] mt-1">{user?.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2.5">
          {['maintenance', 'users', 'vendors', 'reports'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              
              className={`w-full flex items-center space-x-3.5 p-3 rounded-md transition capitalize font-medium ${activeTab === tab ? 'bg-[#155e75] text-[#22d3ee] shadow' : 'text-[#cbd5e1] hover:bg-[#1e293b] hover:text-white'}`}
            >
              {tab === 'maintenance' && <Wrench size={20} />}
              {tab === 'users' && <Users size={20} />}
              {tab === 'vendors' && <Store size={20} />}
              {tab === 'reports' && <FileText size={20} />}
              <span>{tab === 'maintenance' ? 'Maintenance' : tab}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1e293b]">
          <button onClick={logout} className="w-full flex items-center justify-center space-x-2 p-3 bg-red-950/20 text-red-400 rounded-md hover:bg-red-900/30 transition border border-red-900/50">
            <LogOut size={20} /> <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-10 pb-4 border-b border-[#1e293b]">
          <h1 className="text-3xl font-extrabold text-[#f1f5f9] capitalize tracking-tight">{activeTab} Hub</h1> {/* CHANGED: Whiter text, changed title suffix */}
        </header>

        {message && (
          
          <div className={`p-4 mb-6 rounded-md flex items-center space-x-3 border ${message.type === 'error' ? 'bg-red-950/50 text-red-300 border-red-800' : 'bg-cyan-950/50 text-cyan-300 border-cyan-800'}`}>
            {message.type === 'error' ? <AlertCircle size={20}/> : <CheckCircle size={20}/>}
            <span>{message.text}</span>
          </div>
        )}

        {/* --- MAINTENANCE TAB --- */}
        {activeTab === 'maintenance' && (
          
          <div className="bg-[#111827] rounded-lg shadow-xl border border-[#1e293b] overflow-hidden">
            <div className="flex border-b border-[#1e293b] bg-[#1a2333]">
              
              <button className={`flex-1 py-4.5 font-semibold text-sm transition ${maintenanceView === 'add' ? 'bg-[#111827] text-[#22d3ee] border-b-2 border-[#22d3ee]' : 'text-[#94a3b8] hover:text-white'}`} onClick={() => { setMaintenanceView('add'); setMessage(null); }}>Add Membership</button>
              <button className={`flex-1 py-4.5 font-semibold text-sm transition ${maintenanceView === 'update' ? 'bg-[#111827] text-[#22d3ee] border-b-2 border-[#22d3ee]' : 'text-[#94a3b8] hover:text-white'}`} onClick={() => { setMaintenanceView('update'); setMessage(null); }}>Update Membership</button>
            </div>
            <div className="p-10">
              {/* Add form */}
              {maintenanceView === 'add' && (
                <form onSubmit={handleAddSubmit} className="max-w-md space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#f1f5f9] mb-2">User Email / ID *</label>
                    <input type="text" required className="w-full p-3.5 bg-[#1f2937] border border-[#374151] text-white rounded-md focus:ring-2 focus:ring-[#22d3ee] outline-none" placeholder="user@example.com" value={addForm.userId} onChange={(e) => setAddForm({...addForm, userId: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#f1f5f9] mb-3">Duration *</label>
                    <div className="space-y-3.5">
                      {['6 months', '1 year', '2 years'].map(duration => (
                        <label key={duration} className="flex items-center space-x-3.5 cursor-pointer text-[#cbd5e1] hover:text-white">
                          <input type="radio" name="duration" value={duration} checked={addForm.duration === duration} onChange={(e) => setAddForm({...addForm, duration: e.target.value})} className="w-5 h-5 text-[#22d3ee] focus:ring-[#22d3ee] accent-[#22d3ee]" />
                          <span>{duration} {duration === '6 months' && '(Default)'}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-[#155e75] text-[#22d3ee] font-bold p-3.5 rounded-md hover:bg-[#164e63] transition shadow-md border border-[#0e7490]">Create Membership</button>
                </form>
              )}

              {/* Update form */}
              {maintenanceView === 'update' && (
                <form onSubmit={handleUpdateSubmit} className="max-w-md space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#f1f5f9] mb-2">Membership Number *</label>
                    <input type="text" required className="w-full p-3.5 bg-[#1f2937] border border-[#374151] text-white rounded-md focus:ring-2 focus:ring-[#22d3ee] outline-none" placeholder="MEM-12345" value={updateForm.membershipNo} onChange={(e) => setUpdateForm({...updateForm, membershipNo: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#f1f5f9] mb-3">Action *</label>
                    <div className="space-y-3.5">
                      <label className="flex items-center space-x-3.5 cursor-pointer text-[#cbd5e1] hover:text-white">
                        <input type="radio" name="action" value="extend" checked={updateForm.action === 'extend'} onChange={(e) => setUpdateForm({...updateForm, action: e.target.value})} className="w-5 h-5 text-[#22d3ee] accent-[#22d3ee]" />
                        <span>Extend Membership (6 months)</span>
                      </label>
                      <label className="flex items-center space-x-3.5 cursor-pointer text-[#cbd5e1] hover:text-white">
                        <input type="radio" name="action" value="cancel" checked={updateForm.action === 'cancel'} onChange={(e) => setUpdateForm({...updateForm, action: e.target.value})} className="w-5 h-5 text-red-500 accent-red-600" />
                        <span className="text-red-400">Cancel Membership</span>
                      </label>
                    </div>
                  </div>
                  <button type="submit" className={`w-full font-bold p-3.5 rounded-md transition shadow-md ${updateForm.action === 'cancel' ? 'bg-red-950 text-red-300 hover:bg-red-900 border border-red-800' : 'bg-[#155e75] text-[#22d3ee] hover:bg-[#164e63] border border-[#0e7490]'}`}>
                    {updateForm.action === 'extend' ? 'Process Extension' : 'Confirm Cancellation'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* --- DATA TABS (Users, Vendors, Reports) --- */}
        {['users', 'vendors', 'reports'].includes(activeTab) && (
          
          <div className="bg-[#111827] rounded-lg shadow-xl border border-[#1e293b] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#1a2333] border-b border-[#1e293b]">
                
                <tr className="text-[#f1f5f9]">
                  {activeTab === 'users' && <><th className="p-4.5">User ID</th><th className="p-4.5">Email Address</th><th className="p-4.5">Joined Date</th></>}
                  {activeTab === 'vendors' && <><th className="p-4.5">Vendor ID</th><th className="p-4.5">Business Email</th><th className="p-4.5">Registered</th></>}
                  {activeTab === 'reports' && <><th className="p-4.5">Transaction ID</th><th className="p-4.5">Date</th><th className="p-4.5">Total</th><th className="p-4.5">Status</th></>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {activeTab === 'users' && usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-[#1a2333]"><td className="p-4.5 font-mono text-sm text-[#94a3b8]">{u._id}</td><td className="p-4.5 text-[#f1f5f9]">{u.email}</td><td className="p-4.5 text-sm text-[#94a3b8]">{new Date(u.createdAt).toLocaleDateString()}</td></tr>
                ))}
                {activeTab === 'vendors' && vendorsList.map((v) => (
                  <tr key={v._id} className="hover:bg-[#1a2333]"><td className="p-4.5 font-mono text-sm text-[#94a3b8]">{v._id}</td><td className="p-4.5 text-[#f1f5f9]">{v.email}</td><td className="p-4.5 text-sm text-[#94a3b8]">{new Date(v.createdAt).toLocaleDateString()}</td></tr>
                ))}
                {activeTab === 'reports' && reportsList.map((r) => (
                  <tr key={r._id} className="hover:bg-[#1a2333]">
                    <td className="p-4.5 font-mono text-sm text-[#94a3b8]">{r._id}</td>
                    <td className="p-4.5 text-sm text-[#94a3b8]">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="p-4.5 font-extrabold text-[#f1f5f9]">${r.totalAmount.toFixed(2)}</td>
                    <td className="p-4.5"><span className="px-3.5 py-1.5 bg-[#164e63] text-[#22d3ee] rounded-full text-xs font-bold border border-[#0e7490]">Checkout</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}