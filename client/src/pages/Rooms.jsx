import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering States
  const [priceRange, setPriceRange] = useState(50000);
  const [type, setType] = useState('All');
  const [capacity, setCapacity] = useState('All');

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rooms, priceRange, type, capacity]);

  const fetchRooms = async () => {
    try {
      console.log('Fetching rooms...');
      const { data } = await API.get('/api/public/rooms');
      console.log('Rooms fetched:', data);
      setRooms(data);
      setFilteredRooms(data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    try {
      console.log('Applying filters...', { type, capacity, priceRange });
      let temp = [...rooms];

      if (type !== 'All') {
        temp = temp.filter(r => r.type && r.type.toLowerCase().includes(type.toLowerCase()));
      }

      if (capacity !== 'All') {
        temp = temp.filter(r => r.capacity >= parseInt(capacity));
      }

      const maxPrice = Number(priceRange);
      temp = temp.filter(r => r.price <= maxPrice);

      console.log('Filtered rooms:', temp.length);
      setFilteredRooms(temp);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const roomTypes = ['All', 'Single', 'Double', 'Suite', 'Deluxe', 'Family'];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-dark py-24 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 font-display uppercase tracking-[0.2em]">Our Luxury Rooms</h1>
        <div className="w-24 h-1 bg-gold mx-auto"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 space-y-10">
          <div>
            <h3 className="text-xs font-bold tracking-widest text-dark uppercase mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-gold"></span> Filter By Type
            </h3>
            <div className="space-y-3">
              {roomTypes.map(t => (
                <button 
                  key={t}
                  onClick={() => setType(t)}
                  className={`block w-full text-left p-3 text-xs font-bold tracking-widest transition-all ${type === t ? 'bg-dark text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
             <h3 className="text-xs font-bold tracking-widest text-dark uppercase mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-gold"></span> Max Price: ${priceRange}
            </h3>
            <input 
              type="range" 
              min="0" 
              max="50000" 
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gold"
            />
            <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
              <span>$0</span>
              <span>$50000</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest text-dark uppercase mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-gold"></span> Capacity
            </h3>
            <select 
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full bg-gray-50 border-none p-4 text-xs font-bold tracking-widest text-dark outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="All">ANY CAPACITY</option>
              <option value="1">1+ GUESTS</option>
              <option value="2">2+ GUESTS</option>
              <option value="3">3+ GUESTS</option>
              <option value="4">4+ GUESTS</option>
            </select>
          </div>
        </aside>

        {/* Rooms Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
          ) : filteredRooms.length === 0 ? (
             <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
               <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">No rooms found matching your criteria</p>
               <button onClick={() => { setType('All'); setPriceRange(5000); setCapacity('All'); }} className="mt-4 text-gold text-[10px] font-bold tracking-widest underline uppercase">Reset Filters</button>
             </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredRooms.map(room => (
                <div key={room._id} className="group overflow-hidden rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500">
                   <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={room.images?.[0] || room.hotelId?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'} 
                      alt={room.type} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-dark/80 backdrop-blur-sm text-gold px-4 py-2 text-xs font-bold tracking-widest rounded-full">
                      ${room.price}/NIGHT
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl font-bold text-dark font-display uppercase tracking-widest">{room.type}</h3>
                       <div className="flex items-center gap-1 text-gold">
                         <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3-.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                         <span className="text-[10px] font-bold">5.0</span>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                      <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                      <span>{room.hotelId?.name}</span>
                      <span className="mx-1">•</span>
                      <span>{room.hotelId?.location?.city}</span>
                    </div>

                    <div className="flex items-center gap-6 mb-8">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
                        <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        {room.capacity} GUESTS
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full">
                        <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                        {room.amenities?.length || 0} AMENITIES
                      </span>
                    </div>
                    <Link 
                      to={`/hotel/${room.hotelId?._id}?roomId=${room._id}`} 
                      className="inline-block w-full text-center py-4 bg-dark text-white text-[10px] font-bold tracking-[0.2em] rounded-full hover:bg-gold transition-all duration-300 shadow-xl shadow-dark/10"
                    >
                      VIEW DETAILS & BOOK
                    </Link>
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

export default Rooms;
