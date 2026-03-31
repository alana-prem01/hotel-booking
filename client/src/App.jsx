import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages to be created
import Home from './pages/Home';
import About from './pages/About';
import Rooms from './pages/Rooms';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import HotelDetails from './pages/HotelDetails';
import Checkout from './pages/Checkout';
import UserProfile from './pages/UserProfile';
import ForgotPassword from './pages/ForgotPassword';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import ManageHotels from './pages/owner/ManageHotels';
import OwnerManageBookings from './pages/owner/ManageBookings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageOwners from './pages/admin/ManageOwners';

function App() {
  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Toaster position="top-right" />
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes for User */}
          <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/bookings" element={<UserProfile />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          {/* Protected Routes for Owner */}
          <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/hotels" element={<ManageHotels />} />
            <Route path="/owner/bookings" element={<OwnerManageBookings />} />
          </Route>

          {/* Protected Routes for Admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/owners" element={<ManageOwners />} />
            {/* Can re-use components or just rely on these for now */}
          </Route>
          
        </Routes>
      </main>
    </div>
  );
}

export default App;
