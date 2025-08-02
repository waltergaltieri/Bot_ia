import mongoose, { Schema } from "mongoose";
import { Publication } from "../../../schemas/entities";

const Publication = new Schema<Publication>(
  {
    userId: { type: String, required: true },
    originalMessage: { type: String, required: true },
    proposedCopy: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { type: String, required: true, enum: ["DRAFT", "PUBLISHED", "ARCHIVED"] },
    process: { type: String, required: true, enum: ["IN_PROGRESS", "COMPLETED", "CANCELLED"] },
    images: { type: [String], required: false },
  }
);


export const PublicationSchema = mongoose.model<Publication>("Publication", Publication);