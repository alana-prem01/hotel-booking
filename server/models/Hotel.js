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
      state: { type: String },
      country: { type: String },
      zipCode: { type: String },
    },
    description: { type: String, required: true },
    images: [{ type: String }],
    amenities: [{ type: String }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    basePricePerNight: { type: Number, required: true },
  },
  { timestamps: true }
);

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;
