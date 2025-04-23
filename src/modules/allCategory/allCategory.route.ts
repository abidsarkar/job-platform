import express from "express";
import { createCategory, getCategories, updateCategory, deleteCategoryItem } from "./allCategory.controller";

const router = express.Router();

// Create new category
router.post("/category", createCategory);

// Get all categories (education, experience, job category)
router.get("/categories", getCategories);

// Update a category by adding an item (e.g., add a new education level)
router.put("/category", updateCategory);

// Delete an item from a category
router.delete("/category-item", deleteCategoryItem);

export const categoryRoutes = router;
