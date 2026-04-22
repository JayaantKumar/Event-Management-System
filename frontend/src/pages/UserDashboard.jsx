import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { ShoppingBag, ShoppingCart, ListChecks, Users, LogOut, CheckCircle, Trash2 } from 'lucide-react';

export default function UserDashboard() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('shop');
  const [message, setMessage] = useState(null);

  // Data States
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({ name: '', email: '', rsvpStatus: 'Pending' });

  // Initial Data Fetch
  useEffect(() => {
    fetchItems();
    fetchOrders();
    fetchGuests();
  }, []);

  const fetchItems = async () => {
    try { const { data } = await api.get('/user/items'); setItems(data); } catch (e) {}
  };
  const fetchOrders = async () => {
    try { const { data } = await api.get('/user/orders'); setOrders(data); } catch (e) {}
  };
  const fetchGuests = async () => {
    try { const { data } = await api.get('/user/guests'); setGuests(data); } catch (e) {}
  };

  // --- CART LOGIC ---
  const addToCart = (item) => {
    const existing = cart.find(c => c.productId === item._id);
    if (existing) {
      setCart(cart.map(c => c.productId === item._id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { productId: item._id, name: item.name, price: item.price, quantity: 1 }]);
    }
    setMessage({ type: 'success', text: `${item.name} added to cart!` });
    setTimeout(() => setMessage(null), 3000);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      await api.post('/user/orders', { items: cart, totalAmount: cartTotal });
      setCart([]); // Clear cart
      fetchOrders(); // Refresh orders
      setMessage({ type: 'success', text: 'Payment successful! Order placed.' });
      setActiveTab('orders'); // Redirect to orders tab
    } catch (error) {
      alert("Checkout failed");
    }
  };

  // --- GUEST LOGIC ---
  const handleAddGuest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/user/guests', newGuest);
      setNewGuest({ name: '', email: '', rsvpStatus: 'Pending' });
      fetchGuests();
    } catch (e) { alert("Failed to add guest"); }
  };

  const handleDeleteGuest = async (id) => {
    try {
      await api.delete(`/user/guests/${id}`);
      setGuests(guests.filter(g => g._id !== id));
    } catch (e) { alert("Failed to delete"); }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-indigo-950 text-white flex flex-col">
        <div className="p-6 text-center border-b border-indigo-900">
          <h2 className="text-xl font-bold text-indigo-300">User Portal</h2>
          <p className="text-xs text-indigo-200 mt-1">{user?.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('shop')} className={`w-full flex items-center justify-between p-3 rounded-lg transition ${activeTab === 'shop' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-900'}`}>
            <div className="flex items-center space-x-3"><ShoppingBag size={20} /> <span>Vendor Shop</span></div>
          </button>
          <button onClick={() => setActiveTab('cart')} className={`w-full flex items-center justify-between p-3 rounded-lg transition ${activeTab === 'cart' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-900'}`}>
            <div className="flex items-center space-x-3"><ShoppingCart size={20} /> <span>My Cart</span></div>
            {cart.length > 0 && <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">{cart.length}</span>}
          </button>
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${activeTab === 'orders' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-900'}`}>
            <ListChecks size={20} /> <span>Order Status</span>
          </button>
          <button onClick={() => setActiveTab('guests')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${activeTab === 'guests' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-900'}`}>
            <Users size={20} /> <span>Guest List</span>
          </button>
        </nav>

        <div className="p-4 border-t border-indigo-900">
          <button onClick={logout} className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition">
            <LogOut size={20} /> <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 capitalize">
            {activeTab === 'shop' ? 'Browse Vendor Items' : activeTab}
          </h1>
        </header>

        {message && (
          <div className="p-4 mb-6 rounded-lg bg-green-100 text-green-700 flex items-center space-x-2">
            <CheckCircle size={20} /> <span>{message.text}</span>
          </div>
        )}

        {/* SHOP TAB */}
        {activeTab === 'shop' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                  <p className="text-2xl font-black text-indigo-600 mt-2">${item.price}</p>
                </div>
                <button 
                  onClick={() => addToCart(item)}
                  className="mt-6 w-full bg-indigo-50 text-indigo-700 font-semibold py-2 rounded-lg hover:bg-indigo-100 transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CART TAB */}
        {activeTab === 'cart' && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-3xl">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
            ) : (
              <div>
                <ul className="divide-y divide-gray-100">
                  {cart.map((item, idx) => (
                    <li key={idx} className="py-4 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} x ${item.price}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-bold text-gray-800">${item.price * item.quantity}</p>
                        <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                  <p className="text-xl font-bold text-gray-800">Total: ${cartTotal.toFixed(2)}</p>
                  <div className="space-x-3">
                    <button onClick={() => setCart([])} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium transition">Clear Cart</button>
                    <button onClick={handleCheckout} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-md">Simulate Payment & Checkout</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Total Amount</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-mono text-xs text-gray-500">{order._id}</td>
                    <td className="p-4 text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-gray-800">${order.totalAmount}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">{order.status}</span>
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
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
              <h3 className="font-bold text-gray-800 mb-4">Add Guest</h3>
              <form onSubmit={handleAddGuest} className="space-y-4">
                <input required type="text" placeholder="Full Name" className="w-full p-2 border rounded" value={newGuest.name} onChange={e => setNewGuest({...newGuest, name: e.target.value})} />
                <input required type="email" placeholder="Email Address" className="w-full p-2 border rounded" value={newGuest.email} onChange={e => setNewGuest({...newGuest, email: e.target.value})} />
                <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700">Add to List</button>
              </form>
            </div>
            
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead><tr className="bg-gray-50 border-b"><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">RSVP</th><th className="p-4"></th></tr></thead>
                <tbody>
                  {guests.map(guest => (
                    <tr key={guest._id} className="border-b">
                      <td className="p-4 font-medium">{guest.name}</td>
                      <td className="p-4 text-sm text-gray-500">{guest.email}</td>
                      <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{guest.rsvpStatus}</span></td>
                      <td className="p-4 text-right"><button onClick={() => handleDeleteGuest(guest._id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}