import mongoose, { Schema, Document } from "mongoose";

// Category Schema and Model
export interface ICategory extends Document {
  categoryType: "education" | "experience" | "jobCategory";  // Define the possible category types
  items: string[];  // Array to store category items (e.g., job titles, experiences, education types)
}

const categorySchema = new Schema<ICategory>({
  categoryType: {
    type: String,
    required: true,
    enum: ["education", "experience", "jobCategory"],  // Only allows the above 3 types
  },
  items: {
    type: [String],  // Array of strings (each item is a category entry like "Bachelor's Degree", "5+ years", "Software Developer")
    required: true,
  },
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);
