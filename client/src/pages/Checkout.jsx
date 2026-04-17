import { useState, useContext } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

// Loads Razorpay SDK dynamically
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  if (!location.state) {
    return <Navigate to="/" replace />;
  }

  const { hotelId, roomId, checkIn, checkOut, totalAmount, nights, roomDetails, hotelDetails, guests } = location.state;

  // Helper to create booking record in DB after successful payment
  const createBookingRecord = async (paymentId, paymentMethodType) => {
    const { data } = await API.post('/api/users/bookings', {
      hotelId,
      roomId,
      checkIn,
      checkOut,
      totalAmount,
      guests,
      paymentMethod: paymentMethodType,
      paymentId,
    }, { withCredentials: true });
    return data;
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      // 1. Load SDK
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        toast.error('Payment service unavailable. Please try again.');
        setLoading(false);
        return;
      }

      // 2. Create order on backend
      const { data: orderData } = await API.post('/api/payment/create-order', {
        amount: totalAmount,
      }, { withCredentials: true });

      // 3. Open Razorpay modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: 'INR',
        name: hotelDetails?.name || 'LuxeStay',
        description: `${roomDetails?.type} — ${nights} Night(s)`,
        order_id: orderData.orderId,
        theme: { color: '#D4AF37' },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        handler: async (response) => {
          try {
            // 4. Verify payment signature on backend
            const { data: verifyData } = await API.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, { withCredentials: true });

            if (verifyData.verified) {
              // 5. Create booking in DB
              await createBookingRecord(response.razorpay_payment_id, 'razorpay');
              toast.success('🎉 Payment Successful! Booking Confirmed!');
              navigate('/profile');
            } else {
              toast.error('Payment verification failed. Contact support.');
            }
          } catch (err) {
            toast.error('Booking could not be saved. Contact support.');
          }
          setLoading(false);
        },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled.', { icon: 'ℹ️' });
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  const handlePayAtHotel = async () => {
    setLoading(true);
    try {
      await createBookingRecord(null, 'pay_at_hotel');
      toast.success('Booking confirmed! Pay at hotel.');
      navigate('/profile');
    } catch (error) {
      toast.error('Failed to confirm booking');
    }
    setLoading(false);
  };

  const handleConfirmBooking = () => {
    if (paymentMethod === 'pay_at_hotel') {
      handlePayAtHotel();
    } else {
      handleRazorpayPayment();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content: Info & Payment */}
          <div className="lg:w-2/3 space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h1 className="text-3xl font-bold text-dark mb-8 font-display uppercase tracking-widest">Complete Your Booking</h1>
              
              {/* Payment Method Tabs */}
              <div className="flex gap-4 mb-10">
                {[
                  { id: 'razorpay', label: 'Pay Online (Razorpay)', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                  { id: 'pay_at_hotel', label: 'Pay at Hotel', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border-2 transition-all duration-300 ${
                      paymentMethod === method.id 
                        ? 'border-gold bg-dark text-white' 
                        : 'border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={method.icon}/></svg>
                    <span className="text-xs font-bold uppercase tracking-widest">{method.label}</span>
                  </button>
                ))}
              </div>

              {/* Razorpay Info Panel */}
              {paymentMethod === 'razorpay' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl text-center border border-blue-100">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-100">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                      </svg>
                    </div>
                    <h3 className="font-bold text-dark mb-2 tracking-widest uppercase text-sm">Secure Online Payment</h3>
                    <p className="text-sm text-gray-500 mb-2">You will be redirected to Razorpay's secure checkout.</p>
                    <p className="text-[10px] text-blue-700 font-bold uppercase tracking-widest">Supports UPI · Cards · Net Banking · Wallets</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'pay_at_hotel' && (
                <div className="bg-emerald-50/50 p-10 rounded-2xl text-center animate-in fade-in duration-500">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-emerald-100">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                   </div>
                   <p className="text-sm text-emerald-900/70 font-medium mb-2">Secure your room now and pay on arrival.</p>
                   <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-widest leading-loose">No payment required today</p>
                </div>
              )}
            </div>

            {/* Review Section */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-dark mb-6 tracking-widest uppercase flex items-center gap-3">
                <span className="w-1.5 h-6 bg-gold rounded-full"></span>
                Reservation Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Check-in</p>
                  <p className="text-sm font-bold text-dark">{new Date(checkIn).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Check-out</p>
                  <p className="text-sm font-bold text-dark">{new Date(checkOut).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Stay</p>
                  <p className="text-sm font-bold text-dark">{nights} Nights</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">Guests</p>
                  <p className="text-sm font-bold text-dark">{guests} Guests</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Price Column */}
          <div className="lg:w-1/3">
            <div className="bg-dark p-8 rounded-[2rem] text-white shadow-2xl sticky top-32">
              <h2 className="text-xl font-bold mb-8 tracking-widest uppercase border-b border-white/10 pb-4">Total Quote</h2>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{roomDetails?.type} x {nights}</span>
                  <span className="font-bold font-display">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Service Fee</span>
                  <span className="font-bold font-display">₹0</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">GST</span>
                  <span className="font-bold font-display">Included</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mb-10">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Total Amount</span>
                  <span className="text-4xl font-bold font-display text-gold">₹{totalAmount}</span>
                </div>
              </div>

              <button 
                onClick={handleConfirmBooking} 
                disabled={loading}
                className="w-full py-5 bg-gold text-dark font-bold text-[10px] tracking-[0.2em] rounded-2xl shadow-xl hover:bg-white transition-all duration-300 disabled:bg-gray-700 disabled:text-gray-500 relative overflow-hidden"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-dark" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    PROCESSING...
                  </span>
                ) : (
                  paymentMethod === 'pay_at_hotel' ? 'CONFIRM RESERVATION' : 'PAY ₹' + totalAmount + ' NOW'
                )}
              </button>
              
              <p className="text-[9px] text-center text-gray-500 mt-6 leading-relaxed tracking-wider uppercase">
                {paymentMethod === 'razorpay' ? 'Secured by Razorpay · 256-bit SSL encrypted' : 'Free cancellation before check-in'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
