import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) return setError('Email and Password are required');

    try {
      if (!isLoginMode) {
        await api.post('/auth/register', { email, password, role, name });
        setSuccess('Account created! Logging you in...');
      }

      const userData = await login(email, password);

      if (userData.role === 'admin') navigate('/admin');
      else if (userData.role === 'vendor') navigate('/vendor');
      else navigate('/user');

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    }
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setSuccess('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4">
      <div className="w-full max-w-md bg-[#1e293b] p-10 rounded-2xl shadow-2xl border border-[#334155]">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-white tracking-tight">
          {isLoginMode ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-center text-[#94a3b8] mb-8">
          {isLoginMode ? 'Sign in to the Event Management System' : 'Join the platform today'}
        </p>

        {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-6 text-sm text-center border border-red-500/20">{error}</div>}
        {success && <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl mb-6 text-sm text-center border border-emerald-500/20">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-semibold text-[#cbd5e1] mb-1.5">Full Name</label>
              <input
                type="text"
                className="w-full p-3.5 bg-[#0f172a] border border-[#334155] text-white rounded-xl focus:ring-2 focus:ring-[#6366f1] outline-none transition"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="John Doe"
                required={!isLoginMode}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#cbd5e1] mb-1.5">Email Address</label>
            <input
              type="email"
              className="w-full p-3.5 bg-[#0f172a] border border-[#334155] text-white rounded-xl focus:ring-2 focus:ring-[#6366f1] outline-none transition"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#cbd5e1] mb-1.5">Password</label>
            <input
              type="password"
              className="w-full p-3.5 bg-[#0f172a] border border-[#334155] text-white rounded-xl focus:ring-2 focus:ring-[#6366f1] outline-none transition"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-sm font-semibold text-[#cbd5e1] mb-1.5">Select Role</label>
              <select
                className="w-full p-3.5 bg-[#0f172a] border border-[#334155] text-white rounded-xl focus:ring-2 focus:ring-[#6366f1] outline-none transition appearance-none cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">Standard User</option>
                <option value="vendor">Vendor</option>
                <option value="admin">System Admin</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full bg-[#4f46e5] text-white font-bold py-3.5 rounded-xl hover:bg-[#4338ca] transition duration-300 shadow-lg shadow-[#4f46e5]/30">
            {isLoginMode ? 'Log In' : 'Register & Access'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={switchMode}
            className="text-sm text-[#94a3b8] hover:text-[#818cf8] font-medium transition"
          >
            {isLoginMode
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}