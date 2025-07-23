import mongoose, { Schema } from "mongoose";
import { LinkedInLocale, LinkedInProfile, User } from "../../../schemas";

const LinkedInLocaleSchema = new Schema<LinkedInLocale>(
  {
    country: { type: String, required: true },
    language: { type: String, required: true },
  },
  { _id: false }
);

const LinkedInProfileSchema = new Schema<LinkedInProfile>(
  {
    sub: { type: String, required: true },
    email_verified: { type: Boolean, required: true },
    name: { type: String, required: true },
    locale: { type: LinkedInLocaleSchema, required: true },
    given_name: { type: String, required: true },
    family_name: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String, required: true },
  },
  { _id: false }
);

const User = new Schema<User>({
  email: { type: String, required: false, unique: true, default: null },
  name: { type: String, required: false, default: null },
  phone: { type: String, required: true },
  companyId: { type: String, required: false, default: null, name: "company_id" },
  teamId: { type: String, required: false, default: null, name: "team_id" },
  role: { type: String, required: true, enum: ["super_admin", "branch_manager", "manager", "employee"] },
  isActive: { type: Boolean, required: true, default: true, name: "is_active" },
  createdAt: { type: Date, required: true, default: Date.now, name: "created_at" },
  updatedAt: { type: Date, required: true, default: Date.now, name: "updated_at" },
  deletedAt: { type: Date, required: false, default: null, name: "deleted_at" },
  isDeleted: { type: Boolean, required: false, default: false, name: "is_deleted" },
  linkedinProfile: {
    type: LinkedInProfileSchema,
    required: false,
    default: null,
    name: "linkedin_profile",
  },
  linkedinAccessToken: { type: String, required: false, default: null, name: "linkedin_access_token" },
});

export const UserScheme = mongoose.model<User>("User", User);
