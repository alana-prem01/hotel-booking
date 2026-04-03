import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking details
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [guests, setGuests] = useState(1);
  const [availability, setAvailability] = useState({ available: true, message: '' });
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const { data } = await axios.get(`/api/public/hotels/${id}`);
        setHotel(data.hotel);
        setRooms(data.rooms);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  // Handle auto-selection from URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomId = queryParams.get('roomId');
    if (roomId && rooms.length > 0) {
      setSelectedRoom(roomId);
    }
  }, [location.search, rooms]);

  // Check availability
  useEffect(() => {
    const checkRoomAvailability = async () => {
      if (!selectedRoom || !checkIn || !checkOut) {
        setAvailability({ available: true, message: '' });
        return;
      }

      const start = new Date(checkIn);
      const end = new Date(checkOut);
      if (end <= start) {
        setAvailability({ available: false, message: 'Check-out must be after check-in' });
        return;
      }

      setCheckingAvailability(true);
      try {
        const { data } = await axios.get(`/api/public/rooms/${selectedRoom}/availability`, {
          params: { checkIn, checkOut }
        });
        setAvailability({ 
          available: data.available, 
          message: data.available ? '' : `Fully booked for these dates (${data.remaining} rooms left)`
        });
      } catch (error) {
        console.error('Availability check failed:', error);
      }
      setCheckingAvailability(false);
    };

    checkRoomAvailability();
  }, [selectedRoom, checkIn, checkOut]);

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book a room');
      navigate('/login');
      return;
    }
    
    if (!checkIn || !checkOut || !selectedRoom) {
      toast.error('Please select dates and a room');
      return;
    }

    setCheckingAvailability(true);
    try {
      // Final fresh check before checkout
      const { data } = await axios.get(`/api/public/rooms/${selectedRoom}/availability`, {
        params: { checkIn, checkOut }
      });
      
      if (!data.available) {
        setAvailability({ 
          available: false, 
          message: `Opps! The room was just booked (${data.remaining} left)` 
        });
        toast.error('Sorry, this room was just booked by someone else!');
        setCheckingAvailability(false);
        return;
      }
    } catch (error) {
      console.error('Final availability check failed:', error);
      toast.error('Could not verify availability. Please try again.');
      setCheckingAvailability(false);
      return;
    }
    setCheckingAvailability(false);

    const room = rooms.find(r => r._id === selectedRoom);
    const start = new Date(checkIn);

    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      toast.error('Check-out must be after check-in');
      return;
    }

    const totalAmount = nights * room.price;

    navigate('/checkout', { 
      state: { 
        hotelId: hotel._id, 
        roomId: selectedRoom, 
        checkIn, 
        checkOut, 
        guests,
        totalAmount,
        nights,
        roomDetails: room,
        hotelDetails: hotel
      } 
    });
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  if (!hotel) return <div className="min-h-screen flex justify-center items-center">Hotel not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{hotel.name}</h1>
        <p className="text-gray-600 flex items-center gap-1">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          {hotel.location.address}, {hotel.location.city}, {hotel.location.country}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="col-span-2">
          {/* Images */}
          <div className="h-[500px] bg-gray-200 rounded-[2rem] overflow-hidden mb-12 shadow-2xl shadow-dark/5">
            {hotel.images && hotel.images[0] ? (
              <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold tracking-widest uppercase text-xs">No Image Available</div>
            )}
          </div>
          
          {/* Description */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-dark mb-6 font-display uppercase tracking-widest flex items-center gap-4">
              <span className="w-12 h-0.5 bg-gold"></span>
              About this property
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{hotel.description}</p>
          </div>

          {/* Amenities */}
          <div className="mb-20">
             <h2 className="text-2xl font-bold text-dark mb-8 font-display uppercase tracking-[0.2em] flex items-center gap-4">
               <span className="w-8 h-0.5 bg-gold"></span>
               Amenities
             </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {hotel.amenities?.map((amenity, index) => {
                const lowerAmenity = amenity.toLowerCase();
                let icon = null;
                if (lowerAmenity.includes('wifi')) icon = assets.wifi_icon;
                else if (lowerAmenity.includes('pool')) icon = assets.bath_icon; 
                else if (lowerAmenity.includes('bath') || lowerAmenity.includes('shower')) icon = assets.bath_icon;
                else if (lowerAmenity.includes('tv')) icon = assets.tv_icon;
                else if (lowerAmenity.includes('room service') || lowerAmenity.includes('dining')) icon = assets.dining_icon;
                else if (lowerAmenity.includes('bed')) icon = assets.bed_icon;
                
                return (
                  <div key={index} className="flex items-center gap-4 text-dark bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-gold/30 hover:shadow-gold/5">
                    {icon ? (
                      <img src={icon} alt={amenity} className="w-6 h-6 opacity-60" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gold"></div>
                    )}
                    <span className="font-bold text-[10px] uppercase tracking-widest">{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ROOMS LISTING - PROFESSIONAL SUITE CARDS */}
          <div className="space-y-16">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-[10px] font-bold tracking-[0.4em] text-gold uppercase mb-3 block italic opacity-80">Accommodation</span>
                <h2 className="text-4xl font-bold text-dark font-display uppercase tracking-wider leading-none">
                  Available <br className="sm:hidden" />Room Types
                </h2>
              </div>
              <div className="hidden sm:block w-32 h-px bg-gray-200 mb-4"></div>
            </div>

            <div className="grid grid-cols-1 gap-12">
              {rooms.map(room => (
                <div 
                  key={room._id} 
                  className={`group relative bg-white rounded-[2.5rem] border overflow-hidden flex flex-col lg:flex-row min-h-[400px] transition-all duration-700 ${
                    selectedRoom === room._id 
                      ? 'border-gold shadow-2xl shadow-gold/10 ring-1 ring-gold/20' 
                      : 'border-gray-100 shadow-xl shadow-dark/[0.02] hover:shadow-2xl hover:shadow-dark/10 hover:border-gold/30'
                  }`}
                >
                  {/* Image Section - Left Part */}
                  <div className="lg:w-[45%] h-72 lg:h-auto relative overflow-hidden">
                    <img 
                      src={room.images?.[0] || hotel.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80'} 
                      alt={room.type} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-dark/20 to-transparent pointer-events-none"></div>
                    
                    {/* Floating Badges */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                       <span className="bg-white/95 backdrop-blur-md text-dark px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border border-white/20 shadow-xl">
                        {room.capacity} GUESTS MAX
                      </span>
                      {room.isAvailable && (
                        <span className="bg-gold/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border border-gold/20 shadow-xl">
                          Limited Units
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Section - Right Part */}
                  <div className="lg:w-[55%] p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <span className="text-[9px] font-black tracking-[0.3em] text-gray-400 uppercase italic mb-1 block">Signature Suite</span>
                          <h3 className="text-3xl font-bold text-dark font-display uppercase tracking-tight group-hover:text-gold transition-colors duration-500">
                            {room.type}
                          </h3>
                        </div>
                        <div className="text-right">
                          <div className="flex items-baseline justify-end gap-1">
                            <span className="text-[10px] font-bold text-gray-400">$</span>
                            <span className="text-4xl font-extrabold text-dark tracking-tighter">{room.price}</span>
                          </div>
                          <span className="text-[9px] font-black text-gold uppercase tracking-[0.3em] block mt-1">PER NIGHT</span>
                        </div>
                      </div>
                      
                      <div className="h-px w-full bg-gradient-to-r from-gray-100 via-gray-50 to-transparent mb-8"></div>
                      
                      <p className="text-gray-500 leading-relaxed text-sm mb-8 line-clamp-3 italic font-medium opacity-80">
                        {room.description || "Discover a sanctuary of elegance and modern comfort, perfectly appointed for your sophisticated retreat."}
                      </p>

                      <div className="flex flex-wrap gap-3 mb-10">
                        {room.amenities?.slice(0, 5).map((a, i) => (
                          <div key={i} className="flex items-center gap-2 bg-gray-50/80 px-4 py-2 rounded-xl border border-gray-100 transition-colors group-hover:border-gold/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold/50"></div>
                            <span className="text-[10px] font-bold text-dark/70 uppercase tracking-widest">
                              {a}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
                      <button 
                        onClick={() => {
                          setSelectedRoom(room._id);
                          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                        }}
                        className={`w-full sm:flex-1 py-5 rounded-2xl text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-500 relative overflow-hidden group/btn ${
                          selectedRoom === room._id 
                          ? 'bg-gold text-white shadow-2xl shadow-gold/30' 
                          : 'bg-dark text-white hover:bg-gold shadow-xl shadow-dark/10'
                        }`}
                      >
                         <span className="relative z-10 transition-transform duration-500 group-active/btn:scale-90 inline-block">
                          {selectedRoom === room._id ? '✓ Suite Reserved' : 'Secure This Suite'}
                        </span>
                      </button>
                      <div className="flex items-center gap-3 opacity-40 cursor-help px-2" title="Best Price Guaranteed">
                         <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"></path></svg>
                         <span className="text-[10px] font-bold uppercase tracking-widest">Guaranteed</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="col-span-1">
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-dark/5 p-8 sticky top-32 border border-gray-100">
            <div className="mb-8">
              <span className="text-[10px] font-bold tracking-[0.3em] text-gold uppercase mb-2 block">Reservation</span>
              <h2 className="text-3xl font-bold text-dark font-display uppercase">Book Your <br />Stay</h2>
            </div>
            
            <div className="space-y-6 mb-10">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-dark uppercase tracking-widest mb-2 px-1">Check-in Date</label>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold outline-none transition-colors font-bold text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-dark uppercase tracking-widest mb-2 px-1">Check-out Date</label>
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold outline-none transition-colors font-bold text-xs" />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-dark uppercase tracking-widest mb-2 px-1">Number of Guests</label>
                <select value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-xl focus:border-gold outline-none transition-colors font-bold text-xs appearance-none">
                  {[1,2,3,4,5,6].map(num => <option key={num} value={num}>{num} Guests</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-dark uppercase tracking-widest mb-2 px-1">Room Selection</label>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-dark uppercase tracking-widest italic flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${selectedRoom ? 'bg-gold' : 'bg-gray-300 animate-pulse'}`}></div>
                  {selectedRoom ? rooms.find(r => r._id === selectedRoom)?.type : 'Select a room above'}
                </div>
              </div>

              {availability.message && (
                <div className={`p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest ${availability.available ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {availability.message}
                </div>
              )}
            </div>

            <button 
              onClick={handleBooking} 
              className={`w-full py-5 text-white text-xs font-bold tracking-[0.3em] uppercase rounded-xl shadow-xl shadow-dark/10 transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed ${
                !availability.available ? 'bg-red-500 hover:bg-red-600' : 'bg-dark hover:bg-gold'
              }`}
              disabled={!selectedRoom || !availability.available || checkingAvailability}
            >
              {checkingAvailability ? 'CHECKING...' : !availability.available ? 'UNAVAILABLE' : 'RESERVE NOW'}
            </button>
            <p className="text-center text-[10px] font-bold text-gray-400 mt-6 tracking-widest uppercase italic">Secure Luxury Transaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
