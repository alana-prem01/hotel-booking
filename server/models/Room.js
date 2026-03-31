import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    type: { type: String, required: true }, // e.g., 'Single', 'Double', 'Suite'
    price: { type: Number, required: true },
    capacity: { type: Number, required: true }, // adults
    quantity: { type: Number, required: true }, // total rooms of this type
    amenities: [{ type: String }],
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Room = mongoose.model('Room', roomSchema);
export default Room;
