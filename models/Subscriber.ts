import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Subscriber =
  mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);

export default Subscriber;
