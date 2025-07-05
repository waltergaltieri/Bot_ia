import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  description?: string;
  branch_manager_id?: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  branch_manager_id: {
    type: String,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Create indexes
CompanySchema.index({ name: 1 });
CompanySchema.index({ branch_manager_id: 1 });

export default mongoose.model<ICompany>('Company', CompanySchema);
