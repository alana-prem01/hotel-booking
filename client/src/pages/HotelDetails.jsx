import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  const handleBooking = () => {
    if (!user) {
      toast.error('Please login to book a room');
      navigate('/login');
      return;
    }
    
    if (!checkIn || !checkOut || !selectedRoom) {
      toast.error('Please select dates and a room');
      return;
    }

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

          {/* ROOMS LISTING - NEW CARD UI */}
          <div className="space-y-12">
            <h2 className="text-3xl font-bold text-dark mb-10 font-display uppercase tracking-widest flex items-center gap-4">
              <span className="w-16 h-0.5 bg-gold"></span>
              AVAILABLE ROOM TYPES
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {rooms.map(room => (
                <div key={room._id} className={`group bg-white rounded-[2rem] border overflow-hidden flex flex-col md:flex-row shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-dark/5 ${selectedRoom === room._id ? 'border-gold ring-1 ring-gold' : 'border-gray-100'}`}>
                   <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                    <img 
                      src={room.images?.[0] || hotel.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'} 
                      alt={room.type} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-dark uppercase border border-white">
                      {room.capacity} ADULTS
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-dark uppercase tracking-wide">{room.type}</h3>
                        <div className="text-right">
                          <span className="text-3xl font-bold text-dark">${room.price}</span>
                          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">PER NIGHT</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {room.amenities?.map((a, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-50 text-[10px] font-medium text-gray-500 rounded-full border border-gray-100 italic">
                            # {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedRoom(room._id);
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                      }}
                      className={`w-full md:w-auto px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
                        selectedRoom === room._id 
                        ? 'bg-gold text-white shadow-lg shadow-gold/20' 
                        : 'bg-dark text-white hover:bg-gold'
                      }`}
                    >
                      {selectedRoom === room._id ? 'ROOM SELECTED' : 'SELECT THIS ROOM'}
                    </button>
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
            </div>

            <button 
              onClick={handleBooking} 
              className="w-full py-5 bg-dark hover:bg-gold text-white text-xs font-bold tracking-[0.3em] uppercase rounded-xl shadow-xl shadow-dark/10 transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!selectedRoom}
            >
              RESERVE NOW
            </button>
            <p className="text-center text-[10px] font-bold text-gray-400 mt-6 tracking-widest uppercase italic">Secure Luxury Transaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
