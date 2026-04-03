import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    // Owner specific
    companyName: '',
    contactNumber: ''
  });
  const [isOwner, setIsOwner] = useState(false);
  
  const { registerUser, registerOwner } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let result;
    if (isOwner) {
      result = await registerOwner(formData);
    } else {
      result = await registerUser(formData.name, formData.email, formData.password);
    }

    if (result.success) {
      toast.success(isOwner ? 'Registration successful! Awaiting admin approval.' : 'Registration successful!');
      if (isOwner) navigate('/owner/dashboard');
      else navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-8">Join LuxeStay and discover amazing places</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
            <button type="button" onClick={() => setIsOwner(false)} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isOwner ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Guest</button>
            <button type="button" onClick={() => setIsOwner(true)} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isOwner ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Hotel Owner</button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-dark focus:border-transparent outline-none transition-all" placeholder="John Doe" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-dark focus:border-transparent outline-none transition-all" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-dark focus:border-transparent outline-none transition-all" placeholder="Create a secure password" />
          </div>

          {isOwner && (
            <div className="space-y-5 border-t pt-5 mt-5">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Property Details</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company / Hotel Name</label>
                <input type="text" name="companyName" required={isOwner} value={formData.companyName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-dark focus:border-transparent outline-none transition-all" placeholder="Luxe Hotel Group" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input type="text" name="contactNumber" required={isOwner} value={formData.contactNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-dark focus:border-transparent outline-none transition-all" placeholder="+1 234 567 8900" />
              </div>
            </div>
          )}

          <button type="submit" className="w-full py-3 px-4 bg-dark hover:bg-slate-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark mt-6">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-dark hover:text-slate-700 font-semibold hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
