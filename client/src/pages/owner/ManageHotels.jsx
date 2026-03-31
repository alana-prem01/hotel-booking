import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    description: '',
    basePricePerNight: '',
    // Just using a single comma-separated text input for amenities for simplicity
    amenities: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Edit/Delete State
  const [editingHotel, setEditingHotel] = useState(null);

  // Room Management State
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelRooms, setHotelRooms] = useState([]);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomFormData, setRoomFormData] = useState({
    type: '',
    price: '',
    capacity: '2',
    quantity: '1',
    amenities: ''
  });
  const [roomImage, setRoomImage] = useState(null);
  const [roomImagePreview, setRoomImagePreview] = useState(null);
  const [roomUploading, setRoomUploading] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const { data } = await axios.get('/api/owners/hotels', { withCredentials: true });
      setHotels(data);
    } catch (error) {
      toast.error('Failed to fetch hotels');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property? This will also delete all associated rooms.')) {
      try {
        await axios.delete(`/api/owners/hotels/${id}`, { withCredentials: true });
        toast.success('Property deleted successfully');
        fetchHotels();
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      city: hotel.location.city,
      address: hotel.location.address,
      description: hotel.description,
      basePricePerNight: hotel.basePricePerNight,
      amenities: hotel.amenities.join(', '),
      amenities: hotel.amenities.join(', '),
    });
    setImagePreview(hotel.images[0]);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchHotelRooms = async (hotelId) => {
    try {
      const { data } = await axios.get(`/api/public/hotels/${hotelId}`);
      setHotelRooms(data.rooms);
    } catch (error) {
      toast.error('Failed to fetch rooms');
    }
  };

  const handleOpenRoomModal = (hotel) => {
    setSelectedHotel(hotel);
    fetchHotelRooms(hotel._id);
    setShowRoomModal(true);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setRoomUploading(true);
    try {
      let roomImageUrl = '';
      if (roomImage) {
        const uploadData = new FormData();
        uploadData.append('image', roomImage);
        const { data } = await axios.post('/api/owners/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
        roomImageUrl = data.url;
      }

      const amenitiesArr = roomFormData.amenities.split(',').map(a => a.trim()).filter(a => a);
      const payload = {
        ...roomFormData,
        price: Number(roomFormData.price),
        capacity: Number(roomFormData.capacity),
        quantity: Number(roomFormData.quantity),
        amenities: amenitiesArr,
        images: roomImageUrl ? [roomImageUrl] : []
      };

      await axios.post(`/api/owners/hotels/${selectedHotel._id}/rooms`, payload, { withCredentials: true });
      toast.success('Room added successfully');
      setRoomFormData({ type: '', price: '', capacity: '2', quantity: '1', amenities: '' });
      setRoomImage(null);
      setRoomImagePreview(null);
      fetchHotelRooms(selectedHotel._id);
    } catch (error) {
      toast.error('Failed to add room');
    }
    setRoomUploading(false);
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room type?')) {
      try {
        await axios.delete(`/api/owners/rooms/${roomId}`, { withCredentials: true });
        toast.success('Room type deleted successfully');
        fetchHotelRooms(selectedHotel._id);
      } catch (error) {
        toast.error('Failed to delete room');
      }
    }
  };

  const handleRoomImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRoomImage(file);
      setRoomImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = editingHotel ? editingHotel.images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // Default

      if (image) {
        const uploadData = new FormData();
        uploadData.append('image', image);
        const { data } = await axios.post('/api/owners/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        });
        imageUrl = data.url;
      }

      const amenitiesArr = formData.amenities.split(',').map(a => a.trim()).filter(a => a);
      const payload = {
        name: formData.name,
        location: {
          city: formData.city,
          address: formData.address,
        },
        description: formData.description,
        basePricePerNight: Number(formData.basePricePerNight),
        amenities: amenitiesArr,
        images: [imageUrl],
        amenities: amenitiesArr,
        images: [imageUrl],
      };

      if (editingHotel) {
        await axios.put(`/api/owners/hotels/${editingHotel._id}`, payload, { withCredentials: true });
        toast.success('Property updated successfully');
      } else {
        await axios.post('/api/owners/hotels', payload, { withCredentials: true });
        toast.success('Property and initial room created successfully');
      }

      setShowAddForm(false);
      setEditingHotel(null);
      setFormData({ 
        name: '', city: '', address: '', description: '', basePricePerNight: '', amenities: '',
      });
      setImage(null);
      setImagePreview(null);
      fetchHotels();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process request');
    }
    setUploading(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingHotel(null);
    setFormData({ 
      name: '', city: '', address: '', description: '', basePricePerNight: '', amenities: '',
    });
    setImagePreview(null);
    setImage(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Properties</h1>
        <button 
          onClick={() => showAddForm ? handleCancel() : setShowAddForm(true)}
          className={`${showAddForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-primary-600 hover:bg-primary-700'} text-white px-6 py-2 rounded-lg font-semibold transition-colors`}
        >
          {showAddForm ? 'Cancel' : '+ Add Property'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{editingHotel ? 'Edit Property' : 'Add New Property'}</h2>
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border-gray-300 rounded-lg px-4 py-2 border focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price / Night ($)</label>
                <input required type="number" min="0" value={formData.basePricePerNight} onChange={(e) => setFormData({...formData, basePricePerNight: e.target.value})} className="w-full border-gray-300 rounded-lg px-4 py-2 border focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input required type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full border-gray-300 rounded-lg px-4 py-2 border focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input required type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full border-gray-300 rounded-lg px-4 py-2 border focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (comma separated)</label>
                <input type="text" placeholder="WiFi, Pool, Free Parking" value={formData.amenities} onChange={(e) => setFormData({...formData, amenities: e.target.value})} className="w-full border-gray-300 rounded-lg px-4 py-2 border focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Image</label>
                <div className="flex items-center gap-6">
                  <label className="cursor-pointer group flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-2xl hover:border-primary-500 hover:bg-primary-50 transition-all overflow-hidden relative">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <img src={assets.camera_icon} alt="Upload" className="w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xs text-gray-400 mt-2">Upload</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <p className="text-sm text-gray-500">Upload a clear photo of your property. Max 5MB. JPG, PNG accepted.</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border-gray-300 rounded-lg px-4 py-2 border focus:ring-primary-500 focus:border-primary-500 outline-none"></textarea>
              </div>

            </div>
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={uploading}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-all disabled:bg-gray-400"
              >
                {uploading ? 'Processing...' : (editingHotel ? 'Update Property' : 'Save Property')}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading properties...</div>
      ) : hotels.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">You haven't added any properties yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map(hotel => (
            <div key={hotel._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                {hotel.images && hotel.images[0] ? (
                  <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                {/* Rooms Quick Access */}
                <button 
                  onClick={() => handleOpenRoomModal(hotel)}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-gold hover:text-white transition-all group"
                  title="Manage Rooms"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </button>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 truncate pr-4">{hotel.name}</h3>
                  <span className="text-primary-600 font-bold">${hotel.basePricePerNight}</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{hotel.location?.city}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(hotel)} className="flex-1 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Edit Details</button>
                  <button onClick={() => handleDelete(hotel._id)} className="flex-1 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Room Management Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedHotel?.name}</h2>
                <p className="text-sm text-gray-500">Manage Room Types</p>
              </div>
              <button onClick={() => setShowRoomModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Existing Rooms List */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-2 h-6 bg-primary-500 rounded-full"></span>
                  Existing Rooms
                </h3>
                <div className="space-y-4">
                  {hotelRooms.length === 0 ? (
                    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
                      No rooms added yet.
                    </div>
                  ) : (
                    hotelRooms.map(room => (
                      <div key={room._id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex gap-4">
                        {room.images && room.images[0] ? (
                          <img src={room.images[0]} alt={room.type} className="w-20 h-20 object-cover rounded-lg shrink-0" />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 shrink-0 font-bold uppercase tracking-widest px-2 text-center leading-tight">No Room Image</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-800 truncate">{room.type}</h4>
                            <span className="text-primary-600 font-bold">${room.price}</span>
                          </div>
                          <div className="text-[10px] text-gray-500 flex gap-4 font-bold uppercase tracking-widest">
                            <span>{room.capacity} Adults</span>
                            <span>{room.quantity} Available</span>
                          </div>
                          <button 
                            onClick={() => handleDeleteRoom(room._id)}
                            className="mt-3 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                          >
                            Delete Type
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add New Room Form */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-2 h-6 bg-green-500 rounded-full"></span>
                  Add New Room
                </h3>
                <form onSubmit={handleCreateRoom} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Room Type</label>
                    <select 
                      required 
                      value={roomFormData.type} 
                      onChange={(e) => setRoomFormData({...roomFormData, type: e.target.value})} 
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="">Select Room Type</option>
                      <option value="Single Room">Single Room</option>
                      <option value="Double Room">Double Room</option>
                      <option value="Deluxe Suite">Deluxe Suite</option>
                      <option value="Executive Suite">Executive Suite</option>
                      <option value="Family Room">Family Room</option>
                      <option value="Penthouse">Penthouse</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Price / Night</label>
                      <input required type="number" placeholder="0.00" value={roomFormData.price} onChange={(e) => setRoomFormData({...roomFormData, price: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Capacity</label>
                      <input required type="number" value={roomFormData.capacity} onChange={(e) => setRoomFormData({...roomFormData, capacity: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-primary-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Total Quantity</label>
                    <input required type="number" value={roomFormData.quantity} onChange={(e) => setRoomFormData({...roomFormData, quantity: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Amenities (comma separated)</label>
                    <input type="text" placeholder="TV, WiFi, Mini Bar" value={roomFormData.amenities} onChange={(e) => setRoomFormData({...roomFormData, amenities: e.target.value})} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-primary-500 mb-4" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Room Image</label>
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer group flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-white transition-all overflow-hidden relative">
                        {roomImagePreview ? (
                          <img src={roomImagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center">
                            <img src={assets.camera_icon} alt="Upload" className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleRoomImageChange} className="hidden" />
                      </label>
                      <p className="text-[10px] text-gray-500 italic max-w-[150px]">Upload separate image for this room type</p>
                    </div>
                  </div>
                  <button type="submit" disabled={roomUploading} className="w-full bg-dark text-white text-[10px] font-bold tracking-widest uppercase py-3 rounded-lg hover:bg-gold transition-colors mt-4 disabled:bg-gray-400">
                    {roomUploading ? 'Processing...' : 'SAVE ROOM TYPE'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHotels;
