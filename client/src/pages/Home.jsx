import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState({
    city: ''
  });

  const resultsRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (params = {}) => {
    try {
      setLoading(true);
      const [hotelsRes, roomsRes] = await Promise.all([
        axios.get('/api/public/hotels', { params }),
        axios.get('/api/public/rooms', { params }) // Ensure rooms are also filtered
      ]);
      setHotels(hotelsRes.data);
      setRooms(roomsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData({ city: searchData.city });
    // Scroll to results section
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* --- HERO SECTION --- */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 z-10">
          <div className="inline-block px-4 py-1.5 border border-gold/30 rounded-full mb-6">
            <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">Luxury Stays Await</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-dark leading-[1.1] mb-8 font-display">
            Discover Your <br /> 
            Perfect <span className="text-gold italic font-normal lowercase font-serif">Sanctuary.</span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 max-w-lg leading-relaxed">
            From urban retreats to beachfront havens, find world-class accommodations tailored to your sophisticated taste.
          </p>

          {/* Compact Location Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-4 mb-10 max-w-md bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-gold transition-colors">
            <div className="flex-1 flex items-center gap-3 px-4">
              <svg className="w-5 h-5 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
              <input 
                type="text" 
                placeholder="Search by location..." 
                className="bg-transparent text-dark text-sm outline-none w-full py-2"
                value={searchData.city}
                onChange={(e) => setSearchData({city: e.target.value})}
              />
            </div>
            <button type="submit" className="bg-dark text-white p-3 rounded-xl hover:bg-gold transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </button>
          </form>
          
          <div className="flex items-center gap-8">
            <button className="bg-dark text-white px-8 py-4 text-xs font-bold tracking-widest hover:bg-gold transition-all duration-300 shadow-xl shadow-dark/10">
              EXPLORE MORE
            </button>
          </div>
        </div>

        <div className="lg:w-1/2 relative">
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <img 
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80" 
              alt="Luxury Hotel" 
              className="w-full h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-dark/20"></div>
          </div>
        </div>
      </section>

      {/* --- EXPERIENCE SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid lg:grid-cols-2 gap-20 items-center">
        <div className="grid grid-cols-2 gap-4 relative">
          <div className="space-y-4">
            <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80" alt="Room" className="rounded-lg h-64 w-full object-cover" />
            <div className="bg-dark rounded-full w-32 h-32 flex items-center justify-center text-center p-4 border-8 border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div>
                <span className="block text-2xl font-bold text-white leading-none">15+</span>
                <span className="text-[8px] text-gray-300 font-bold tracking-widest uppercase">Years Experience</span>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <img src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80" alt="Hotel" className="rounded-lg h-80 w-full object-cover shadow-xl" />
          </div>
        </div>
        <div>
          <h2 className="text-4xl lg:text-5xl font-bold text-dark leading-[1.2] mb-8 font-display">
            Spend your vacation <br />
            in comfort & luxury <br />
            at one of our many <br />
            establishments.
          </h2>
          <button className="bg-dark text-white px-8 py-4 text-xs font-bold tracking-widest hover:bg-gold transition-colors mb-12">
            LEARN MORE
          </button>
          
          <div className="grid grid-cols-2 gap-10">
            <div>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Welcome to our Hotel Booking website! We're your go-to platform for finding the perfect accommodation.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-dark"></div>
                <span className="text-[10px] font-bold tracking-widest text-dark uppercase">24/7 Support Service</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                We're dedicated to making your travel experience easy and enjoyable.
              </p>
               <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-dark"></div>
                <span className="text-[10px] font-bold tracking-widest text-dark uppercase">Secure & Easy Booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED HOTELS SECTION --- */}
      <section ref={resultsRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4 font-display uppercase tracking-widest">EXCLUSIVE DESTINATIONS</h2>
            <div className="w-20 h-1 bg-gold mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {hotels.length > 0 ? hotels.map((hotel) => (
              <Link to={`/hotel/${hotel._id}`} key={hotel._id} className="group relative overflow-hidden rounded-3xl shadow-lg aspect-[4/3]">
                <img 
                  src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'} 
                  alt={hotel.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(i => <svg key={i} className="w-3 h-3 text-gold fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3-.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{hotel.name}</h3>
                  <div className="flex items-center gap-2 opacity-80 text-xs">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    <span>{hotel.location?.city}, {hotel.location?.country}</span>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-20 text-gray-400 font-bold tracking-widest text-xs uppercase">
                Discovering properties...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- FACILITIES SECTION --- */}
      <section className="bg-dark py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-20 items-center">
          <div>
             <h2 className="text-4xl lg:text-5xl font-bold text-white leading-[1.2] mb-8 font-display">
              We strive to provide a <br />
              range of facilities & <br />
              amenities to enhance <br />
              your stay and ensure <br />
              your comfort.
            </h2>
            <button className="bg-white text-dark px-8 py-4 text-xs font-bold tracking-widest hover:bg-gold hover:text-white transition-colors">
              LEARN MORE
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Fast Baggage Hand', desc: 'Secure and quick baggage handling for your convenience.' },
              { title: 'Lunch & Dinner', desc: 'Exquisite dining experiences with international cuisines.' },
              { title: 'Beauty & Spa', desc: 'Revitalize your senses with our premium spa treatments.' },
              { title: 'Swimming Pool', desc: 'Temperature controlled outdoor pool with panoramic views.' }
            ].map((f, i) => (
              <div key={i} className="flex gap-4 p-4 border border-gray-800 hover:border-gold/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-[#2A2A2A] flex-shrink-0 flex items-center justify-center border border-gray-700">
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2 tracking-wide uppercase text-xs">{f.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative border-t border-gray-100 pt-20">
             <div className="absolute top-10 left-0">
               <svg className="w-16 h-16 text-gray-100 fill-current" viewBox="0 0 24 24">
                 <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V4H20.017V8H22.017V15C22.017 16.6569 20.6739 18 19.017 18H16.017L16.017 21H14.017ZM1.017 21L1.017 18C1.017 16.8954 1.91243 16 3.017 16H6.017C6.56928 16 7.017 15.5523 7.017 15V9C7.017 8.44772 6.56928 8 6.017 8H3.017C1.91243 8 1.017 7.10457 1.017 6V4H7.017V8H9.017V15C9.017 16.6569 7.67389 18 6.017 18H3.017L3.017 21H1.017Z" />
               </svg>
             </div>
             
             <div className="max-w-4xl mx-auto text-center">
               <p className="text-2xl lg:text-3xl font-medium text-dark leading-relaxed italic mb-10">
                 "I had an incredible stay at this hotel! The staff was very welcoming and attentive, and the facilities were top-notch. The room was spacious, clean, and beautifully designed. The breakfast buffet was delicious with a wide."
               </p>
               <div className="flex flex-col items-center">
                 <img src="https://i.pravatar.cc/100?img=32" alt="Reviewer" className="w-16 h-16 rounded-full border-4 border-white shadow-lg mb-4" />
                 <h5 className="font-bold text-dark">Alex Nikifov</h5>
                 <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Client Review</p>
               </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
