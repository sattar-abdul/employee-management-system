import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['superadmin', 'admin', 'user'], 
    default: 'user' 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  },
  leaveQuota: { type: Number, default: 20 },
  leavesTaken: { type: Number, default: 0 },
}, { timestamps: true });

export default models.User || model('User', UserSchema);