import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get('/api/users/bookings', { withCredentials: true });
        setBookings(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load bookings');
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.put(`/api/users/bookings/${id}/cancel`, {}, { withCredentials: true });
        toast.success('Booking cancelled');
        setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      } catch (error) {
        toast.error('Failed to cancel booking');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center sticky top-24">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-50 flex items-center justify-center border-2 border-gray-100 mb-4 text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 mb-6">{user?.email}</p>
            <div className="inline-block px-4 py-1 rounded-full bg-dark text-gold text-[10px] font-bold uppercase tracking-widest">
              {user?.role}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(n => <div key={n} className="h-48 bg-gray-200 animate-pulse rounded-2xl"></div>)}
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm mt-4">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-500">It looks like you haven't booked any trips yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map(booking => (
                <div key={booking._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row transition-shadow hover:shadow-md">
                  <div className="sm:w-1/3 bg-gray-200 h-48 sm:h-auto">
                    {booking.hotelId?.images?.[0] ? (
                      <img src={booking.hotelId.images[0]} alt={booking.hotelId.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs uppercase tracking-widest bg-gray-50">No Image</div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{booking.hotelId?.name || 'Hotel Unavailable'}</h3>
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            booking.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-amber-100 text-amber-800 shadow-sm'
                          }`}>
                            {booking.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        {booking.hotelId?.location?.city}, {booking.hotelId?.location?.country}
                        {booking.paymentMethod && (
                          <span className="ml-2 text-[10px] text-gray-300 font-bold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            {booking.paymentMethod.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest mb-1">Check-in</p>
                          <p className="font-bold text-gray-700">{new Date(booking.checkIn).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-bold text-[9px] uppercase tracking-widest mb-1">Check-out</p>
                          <p className="font-bold text-gray-700">{new Date(booking.checkOut).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-gray-50 pt-4 mt-2">
                       <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Total Value</span>
                        <div className="text-xl font-bold text-dark tracking-tight">${booking.totalAmount}</div>
                      </div>
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <button 
                          onClick={() => handleCancelBooking(booking._id)}
                          className="px-4 py-2 border border-red-100 text-red-500 hover:bg-red-50 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
