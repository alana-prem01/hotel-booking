import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'ROOM', path: '/rooms' },
    { name: 'MAP SEARCH', path: '/map' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight text-dark font-display">
              Areva
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="text-xs font-bold tracking-widest text-dark hover:text-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Search & Book Now */}
          <div className="flex items-center space-x-6">
            {user ? (
               <div className="relative group">
                <button className="flex items-center gap-2 text-dark hover:text-gold font-medium cursor-pointer py-2">
                  <span className="hidden sm:block text-sm font-semibold uppercase tracking-wider">{user.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className="absolute right-0 w-48 mt-1 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-dark hover:bg-primary-50 hover:text-gold">Admin Dashboard</Link>
                  )}
                  {user.role === 'owner' && (
                    <Link to="/owner/dashboard" className="block px-4 py-2 text-sm text-dark hover:bg-primary-50 hover:text-gold">Owner Dashboard</Link>
                  )}
                  {user.role === 'user' && (
                    <>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-dark hover:bg-primary-50 hover:text-gold">My Profile</Link>
                      <Link to="/bookings" className="block px-4 py-2 text-sm text-dark hover:bg-primary-50 hover:text-gold">My Bookings</Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="hidden sm:inline-block bg-dark text-white text-xs font-bold tracking-widest px-6 py-3 hover:bg-gold transition-all duration-300"
              >
                BOOK NOW
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-dark">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 py-4">
          <div className="px-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="block text-sm font-bold tracking-widest text-dark py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <Link 
                to="/login" 
                className="block bg-dark text-white text-xs font-bold tracking-widest px-6 py-3 text-center mt-4"
                onClick={() => setIsOpen(false)}
              >
                BOOK NOW
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
