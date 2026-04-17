import { useState, useEffect } from 'react';
import API from '../api/axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon issue with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icon for user location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Haversine formula to calculate distance between two coordinates in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
};

// Component to dynamically set map view
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapSearch = () => {
  const [hotels, setHotels] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [nearestHotels, setNearestHotels] = useState([]);

  useEffect(() => {
    fetchHotels();
    getUserLocation();
  }, []);

  useEffect(() => {
    if (hotels.length > 0 && userLocation) {
      calculateNearestHotels();
    }
  }, [hotels, userLocation]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/api/public/hotels');
      setHotels(data);
    } catch (error) {
      console.error('Failed to fetch hotels:', error);
    } finally {
      if (!userLocation) {
        setLoading(false); // If no location yet, stop loading to show map
      }
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        setLocationError('Unable to retrieve your location. Please ensure location services are enabled.');
        setLoading(false);
      }
    );
  };

  const calculateNearestHotels = () => {
    const hotelsWithDistance = hotels.map(hotel => {
      // Fallback if hotel has no lat/lng - skip them from closest calculations
      if (!hotel.location || !hotel.location.lat || !hotel.location.lng) {
        return { ...hotel, distance: Infinity };
      }
      
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        hotel.location.lat,
        hotel.location.lng
      );
      
      return { ...hotel, distance };
    });

    const sortedHotels = hotelsWithDistance
      .filter(h => h.distance !== Infinity)
      .sort((a, b) => a.distance - b.distance);

    setNearestHotels(sortedHotels);
  };

  const center = userLocation ? [userLocation.lat, userLocation.lng] : [51.505, -0.09]; // Default center (London) if no user location

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-dark py-16 text-center">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-display uppercase tracking-[0.2em]">Map Search</h1>
        <div className="w-24 h-1 bg-gold mx-auto mb-4"></div>
        <p className="text-gray-400 text-sm tracking-widest uppercase">Find hotels near you</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Nearest Hotels Sidebar */}
        <aside className="w-full lg:w-96 space-y-8 flex flex-col h-[600px]">
          <div>
            <h3 className="text-sm font-bold tracking-widest text-dark uppercase mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-gold"></span> Nearest Hotels
            </h3>
            {locationError && (
              <p className="text-red-500 text-xs mt-2">{locationError}</p>
            )}
            {!userLocation && !locationError && !loading && (
              <p className="text-gray-500 text-xs mt-2">Waiting for location access...</p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
              </div>
            ) : nearestHotels.length === 0 ? (
               <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                 <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px]">No nearby hotels found with coordinates</p>
               </div>
            ) : (
              nearestHotels.map(hotel => (
                <div key={hotel._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex">
                    <img 
                      src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80'} 
                      alt={hotel.name}
                      className="w-24 h-24 object-cover"
                    />
                    <div className="p-4 flex-1">
                      <h4 className="font-bold text-sm text-dark font-display uppercase truncate">{hotel.name}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{hotel.location?.city}</p>
                      <p className="text-xs font-bold text-gold">
                        {(hotel.distance.toFixed(1))} km away
                      </p>
                      <Link 
                        to={`/hotel/${hotel._id}`}
                        className="mt-2 inline-block text-[10px] font-bold text-white bg-dark px-3 py-1 rounded-full uppercase tracking-widest hover:bg-gold transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Map Container */}
        <div className="flex-1 h-[600px] rounded-3xl overflow-hidden shadow-lg border border-gray-100 z-0">
          <MapContainer center={center} zoom={userLocation ? 12 : 2} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userLocation && (
              <>
                <ChangeView center={center} zoom={12} />
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                  <Popup>
                    <div className="text-center">
                      <strong className="text-dark font-display uppercase tracking-widest text-xs">Your Location</strong>
                    </div>
                  </Popup>
                </Marker>
              </>
            )}
            
            {hotels.map(hotel => {
              if (hotel.location && hotel.location.lat && hotel.location.lng) {
                return (
                  <Marker 
                    key={hotel._id} 
                    position={[hotel.location.lat, hotel.location.lng]}
                  >
                    <Popup>
                      <div className="p-1 min-w-[200px]">
                        <img 
                          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80'} 
                          alt={hotel.name}
                          className="w-full h-24 object-cover rounded-lg mb-2"
                        />
                        <h4 className="font-bold text-sm text-dark font-display uppercase mb-1">{hotel.name}</h4>
                        <p className="text-xs text-gray-500 mb-2 truncate">{hotel.location.address}</p>
                        <p className="text-gold font-bold text-sm mb-3">From ${hotel.basePricePerNight}/night</p>
                        <Link 
                           to={`/hotel/${hotel._id}`}
                           className="block text-center bg-dark text-white text-[10px] uppercase tracking-widest py-2 rounded font-bold hover:bg-gold transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapSearch;
