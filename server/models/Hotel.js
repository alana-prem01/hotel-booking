import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
    },
    name: { type: String, required: true },
    location: {
      city: { type: String, required: true },
      address: { type: String, required: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    description: { type: String, required: true },
    images: [{ type: String }],
    amenities: [{ type: String }],
    basePricePerNight: { type: Number, required: true },
  },
  { timestamps: true }
);

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;
