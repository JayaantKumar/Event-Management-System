import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { ShoppingBag, ShoppingCart, ListChecks, Users, LogOut, CheckCircle, Trash2 } from 'lucide-react';

export default function UserDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('shop');
  const [message, setMessage] = useState(null);

  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({ name: '', email: '', rsvpStatus: 'Pending' });

  useEffect(() => {
    fetchItems(); fetchOrders(); fetchGuests();
  }, []);

  const fetchItems = async () => { try { const { data } = await api.get('/user/items'); setItems(data); } catch (e) {} };
  const fetchOrders = async () => { try { const { data } = await api.get('/user/orders'); setOrders(data); } catch (e) {} };
  const fetchGuests = async () => { try { const { data } = await api.get('/user/guests'); setGuests(data); } catch (e) {} };

  const addToCart = (item) => {
    const existing = cart.find(c => c.productId === item._id);
    if (existing) setCart(cart.map(c => c.productId === item._id ? { ...c, quantity: c.quantity + 1 } : c));
    else setCart([...cart, { productId: item._id, name: item.name, price: item.price, quantity: 1 }]);
    setMessage({ type: 'success', text: `${item.name} added to cart!` });
    setTimeout(() => setMessage(null), 3000);
  };

  const removeFromCart = (productId) => setCart(cart.filter(item => item.productId !== productId));
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      await api.post('/user/orders', { items: cart, totalAmount: cartTotal });
      setCart([]); fetchOrders();
      setMessage({ type: 'success', text: 'Payment successful! Order confirmed.' });
      setActiveTab('orders');
    } catch (error) { alert("Checkout failed"); }
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    try { await api.post('/user/guests', newGuest); setNewGuest({ name: '', email: '', rsvpStatus: 'Pending' }); fetchGuests(); } 
    catch (e) { alert("Failed to add guest"); }
  };

  const handleDeleteGuest = async (id) => {
    try { await api.delete(`/user/guests/${id}`); setGuests(guests.filter(g => g._id !== id)); } 
    catch (e) { alert("Failed to delete"); }
  };

  return (
    <div className="flex h-screen bg-[#fdfcff]">
      
      {/* SIDEBAR: Deep Royal Purple */}
      <aside className="w-64 bg-[#2e1065] text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-[#4c1d95]">
          <h2 className="text-xl font-bold text-[#fcd34d]">Event Planner</h2>
          <p className="text-xs text-[#ddd6fe] mt-1">{user?.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'shop', icon: ShoppingBag, label: 'Vendor Shop' },
            { id: 'cart', icon: ShoppingCart, label: 'My Cart' },
            { id: 'orders', icon: ListChecks, label: 'Order Status' },
            { id: 'guests', icon: Users, label: 'Guest List' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => {setActiveTab(tab.id); setMessage(null);}}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition font-medium
                ${activeTab === tab.id 
                  ? 'bg-[#4c1d95] text-[#fcd34d] shadow-inner' 
                  : 'text-[#ede9fe] hover:bg-[#3b0764]'}`}
            >
              <div className="flex items-center space-x-3"><tab.icon size={20} /> <span>{tab.label}</span></div>
              {tab.id === 'cart' && cart.length > 0 && <span className="bg-[#f59e0b] text-[#451a03] text-xs font-extrabold px-2 py-0.5 rounded-full">{cart.length}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#4c1d95]">
          <button onClick={logout} className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500/10 text-red-300 rounded-lg hover:bg-red-500/20 transition">
            <LogOut size={20} /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="mb-10 border-b border-[#ede9fe] pb-4">
          <h1 className="text-3xl font-extrabold text-[#2e1065] tracking-tight">
            {activeTab === 'shop' ? 'Browse Curated Vendors' : activeTab}
          </h1>
        </header>

        {message && (
          <div className="p-4 mb-8 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] flex items-center space-x-3 font-semibold shadow-sm">
            <CheckCircle size={20} /> <span>{message.text}</span>
          </div>
        )}

        {/* SHOP TAB */}
        {activeTab === 'shop' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#ede9fe] hover:shadow-md transition flex flex-col justify-between group">
                <div>
                  <h3 className="text-lg font-bold text-[#1e1b4b] group-hover:text-[#4c1d95] transition">{item.name}</h3>
                  <p className="text-2xl font-black text-[#d97706] mt-2">${item.price.toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => addToCart(item)}
                  className="mt-6 w-full bg-[#f3e8ff] text-[#6b21a8] font-bold py-2.5 rounded-xl hover:bg-[#4c1d95] hover:text-[#fcd34d] transition duration-300"
                >
                  + Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CART TAB */}
        {activeTab === 'cart' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ede9fe] max-w-3xl">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={48} className="mx-auto text-[#ddd6fe] mb-4" />
                <p className="text-[#6b7280] font-medium text-lg">Your cart is currently empty.</p>
              </div>
            ) : (
              <div>
                <ul className="divide-y divide-[#f3f4f6]">
                  {cart.map((item, idx) => (
                    <li key={idx} className="py-5 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-[#1e1b4b] text-lg">{item.name}</p>
                        <p className="text-sm font-medium text-[#6b7280]">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-6">
                        <p className="font-black text-[#2e1065] text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                        <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-full transition"><Trash2 size={18}/></button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-8 border-t-2 border-[#ede9fe] flex justify-between items-center bg-[#faf5ff] -mx-8 -mb-8 p-8 rounded-b-2xl">
                  <div>
                    <p className="text-sm text-[#6b21a8] font-bold uppercase tracking-wider">Total Due</p>
                    <p className="text-3xl font-black text-[#2e1065]">${cartTotal.toFixed(2)}</p>
                  </div>
                  <div className="space-x-4">
                    <button onClick={() => setCart([])} className="px-5 py-3 text-[#6b7280] hover:bg-white rounded-xl font-bold transition">Clear</button>
                    <button onClick={handleCheckout} className="px-8 py-3 bg-[#d97706] text-white rounded-xl font-extrabold hover:bg-[#b45309] transition shadow-lg shadow-[#d97706]/30">
                      Confirm & Pay
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#ede9fe] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#faf5ff] border-b border-[#ede9fe]">
                <tr>
                  <th className="p-5 font-bold text-[#4c1d95] uppercase text-xs tracking-wider">Order Reference</th>
                  <th className="p-5 font-bold text-[#4c1d95] uppercase text-xs tracking-wider">Date</th>
                  <th className="p-5 font-bold text-[#4c1d95] uppercase text-xs tracking-wider">Total</th>
                  <th className="p-5 font-bold text-[#4c1d95] uppercase text-xs tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-[#f8fafc]">
                    <td className="p-5 font-mono text-sm text-[#9ca3af]">{order._id}</td>
                    <td className="p-5 text-[#4b5563] font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-5 font-black text-[#2e1065]">${order.totalAmount.toFixed(2)}</td>
                    <td className="p-5">
                      <span className="px-4 py-1.5 bg-[#fef3c7] text-[#92400e] border border-[#fde68a] rounded-full text-xs font-extrabold uppercase tracking-wide">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* GUESTS TAB */}
        {activeTab === 'guests' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-[#ede9fe] h-fit">
              <h3 className="font-extrabold text-[#2e1065] text-xl mb-6">Invite Guest</h3>
              <form onSubmit={handleAddGuest} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-1 block">Full Name</label>
                  <input required type="text" className="w-full p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#4c1d95] outline-none transition" value={newGuest.name} onChange={e => setNewGuest({...newGuest, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-1 block">Email</label>
                  <input required type="email" className="w-full p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-[#4c1d95] outline-none transition" value={newGuest.email} onChange={e => setNewGuest({...newGuest, email: e.target.value})} />
                </div>
                <button type="submit" className="w-full mt-2 bg-[#4c1d95] text-[#fcd34d] font-extrabold py-3.5 rounded-xl hover:bg-[#3b0764] transition shadow-md shadow-[#4c1d95]/20">
                  Send Invitation
                </button>
              </form>
            </div>
            
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#ede9fe] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#faf5ff] border-b border-[#ede9fe]">
                  <tr><th className="p-5 font-bold text-[#4c1d95] text-sm">Name</th><th className="p-5 font-bold text-[#4c1d95] text-sm">Email</th><th className="p-5 font-bold text-[#4c1d95] text-sm">RSVP</th><th className="p-5"></th></tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {guests.length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-400 font-medium">Your guest list is empty.</td></tr>
                  ) : (
                    guests.map(guest => (
                      <tr key={guest._id} className="hover:bg-[#f8fafc]">
                        <td className="p-5 font-bold text-[#1e1b4b]">{guest.name}</td>
                        <td className="p-5 text-sm text-[#6b7280]">{guest.email}</td>
                        <td className="p-5"><span className="px-3 py-1 bg-[#f3f4f6] text-[#4b5563] font-bold rounded-lg text-xs border border-[#e5e7eb]">{guest.rsvpStatus}</span></td>
                        <td className="p-5 text-right"><button onClick={() => handleDeleteGuest(guest._id)} className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-full transition"><Trash2 size={16}/></button></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}