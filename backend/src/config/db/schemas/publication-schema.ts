import mongoose, { Schema } from "mongoose";
import { Publication } from "../../../schemas/entities";

const Publication = new Schema<Publication>(
  {
    userId: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { type: String, required: true, enum: ["DRAFT", "PUBLISHED", "ARCHIVED"] },
    process: { type: String, required: true, enum: ["IN_PROGRESS", "COMPLETED", "CANCELLED"] },
  }
);


export const PublicationSchema = mongoose.model<Publication>("Publication", Publication);