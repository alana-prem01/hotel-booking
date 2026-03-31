import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/owners/dashboard', { withCredentials: true });
        setStats(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
        {user?.status === 'pending' && (
          <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold border border-yellow-200">
            Account Status: Pending Approval
          </span>
        )}
        {user?.status === 'rejected' && (
          <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold border border-red-200">
            Account Status: Rejected by Admin
          </span>
        )}
      </div>

      {user?.status === 'pending' ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account under review</h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Your owner account is currently waiting for administrator approval. You will not be able to add properties or manage bookings until approved.
          </p>
        </div>
      ) : user?.status === 'rejected' ? (
         <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Rejected</h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Your owner account application has been rejected by the administrator. Please contact support for more information.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Properties</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalHotels || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats?.revenue || 0}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Quick Actions */}
            <div className="lg:w-1/3 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <Link to="/owner/hotels" className="block w-full bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-primary-500 hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Manage Properties</h3>
                    <p className="text-sm text-gray-500">Add, edit or remove hotels</p>
                  </div>
                </div>
              </Link>

              <Link to="/owner/bookings" className="block w-full bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-primary-500 hover:shadow-md transition-all group">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-50 p-3 rounded-lg text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Manage Bookings</h3>
                    <p className="text-sm text-gray-500">View and handle reservations</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Recent Bookings */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
                  <Link to="/owner/bookings" className="text-sm font-semibold text-primary-600 hover:text-primary-800">View All</Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {stats?.recentBookings?.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No recent bookings</div>
                  ) : (
                    stats?.recentBookings?.map(booking => (
                      <div key={booking._id} className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="font-semibold text-gray-900">Booking #{booking._id.substring(18)}</p>
                          <p className="text-sm text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${booking.totalAmount}</p>
                          <span className={`text-xs font-bold uppercase tracking-wider ${
                            booking.status === 'confirmed' ? 'text-green-600' :
                            booking.status === 'cancelled' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OwnerDashboard;
