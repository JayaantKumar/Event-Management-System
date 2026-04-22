import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true); // Toggles between Login and Register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role for registration
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) return setError('All fields are required');

    try {
      // 1. If in Register mode, create the account first
      if (!isLoginMode) {
        await api.post('/auth/register', { email, password, role });
        setSuccess('Account created! Logging you in...');
      }

      // 2. Log the user in (this runs for normal logins AND auto-logs in after registration)
      const userData = await login(email, password);
      
      // 3. Route dynamically based on their role
      if (userData.role === 'admin') navigate('/admin');
      else if (userData.role === 'vendor') navigate('/vendor');
      else navigate('/user');
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    }
  };

  // Toggle between modes and clear form errors
  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setSuccess('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          {isLoginMode ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-center text-gray-500 mb-8">
          {isLoginMode ? 'Sign in to the Event Management System' : 'Register for a new account'}
        </p>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm text-center">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 text-sm text-center">{success}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
              placeholder="name@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
              onChange={(e) => setPassword(e.target.value)} 
              value={password}
              placeholder="••••••••"
              required
              minLength="6"
            />
          </div>

          {/* Role Dropdown - Only visible during Registration */}
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white transition cursor-pointer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">Standard User</option>
                <option value="vendor">Vendor</option>
                <option value="admin">System Admin</option>
              </select>
            </div>
          )}

          <button type="submit" className="w-full bg-blue-600 text-white font-semibold p-3 rounded-md hover:bg-blue-700 transition duration-200">
            {isLoginMode ? 'Log In' : 'Register & Log In'}
          </button>
        </form>

        {/* Dynamic Mode Toggle */}
        <div className="mt-6 text-center">
          <button 
            onClick={switchMode}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
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