import mongoose from "mongoose";
import { LinkedInProfile } from "../oauth/linkedin-profile";
import { UserRole } from "../../types";

export interface User extends mongoose.Document {
  email: string | null;
  name?: string | null;
  phone: string;
  companyId: string | null;
  teamId?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  isDeleted: boolean;
  linkedinProfile?: LinkedInProfile | null;
  linkedinAccessToken?: string | null;
}