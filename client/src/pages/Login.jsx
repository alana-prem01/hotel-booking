import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlRole = queryParams.get('role');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(urlRole || 'user'); 
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (urlRole) {
      setRole(urlRole);
    }
  }, [urlRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password, role);
    if (result.success) {
      toast.success('Logged in successfully!');
      if (role === 'owner') navigate('/owner/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 capitalize">
          {role === 'admin' ? 'Admin Login' : 'Welcome Back'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {!urlRole && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Login As</label>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setRole('user')} className={`py-2 rounded-lg text-sm font-medium transition-all ${role === 'user' ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>User</button>
                <button type="button" onClick={() => setRole('owner')} className={`py-2 rounded-lg text-sm font-medium transition-all ${role === 'owner' ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Owner</button>
                <button type="button" onClick={() => setRole('admin')} className={`py-2 rounded-lg text-sm font-medium transition-all ${role === 'admin' ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Admin</button>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-400" placeholder="Enter your email" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link to="/forgot-password" size="sm" className="text-xs text-primary-600 hover:underline">Forgot password?</Link>
            </div>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder-gray-400" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
