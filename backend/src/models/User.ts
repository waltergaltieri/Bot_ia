import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password_hash: string;
  name: string;
  phone?: string;
  company_id: string;
  role: 'super_admin' | 'branch_manager' | 'team_manager' | 'agent';
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  company_id: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['super_admin', 'branch_manager', 'team_manager', 'agent'],
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Create indexes
UserSchema.index({ email: 1 });
UserSchema.index({ company_id: 1 });
UserSchema.index({ role: 1 });

export default mongoose.model<IUser>('User', UserSchema);
