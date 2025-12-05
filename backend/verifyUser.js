import mongoose from 'mongoose';
import User from './src/models/User.js';

await mongoose.connect('mongodb://localhost:27017/refocus');

const result = await User.updateOne(
  { email: 'alice@example.com' },
  { $set: { isEmailVerified: true, verificationToken: null, verificationTokenExpires: null } }
);

console.log('Updated:', result);
await mongoose.disconnect();
