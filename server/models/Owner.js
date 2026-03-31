import mongoose from 'mongoose';

const ownerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    companyName: { type: String },
    contactNumber: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Owner = mongoose.model('Owner', ownerSchema);
export default Owner;
