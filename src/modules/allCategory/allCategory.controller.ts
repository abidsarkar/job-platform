import { Request, Response } from "express";
import { Category } from "./allCategory.model";

export const createCategory = async (req: Request, res: Response) => {
  const { categoryType, items } = req.body;  // categoryType can be "education", "experience", or "jobCategory"

  try {
    const newCategory = new Category({
      categoryType,
      items,  // List of items for this category type (e.g., education levels, experience, job categories)
    });

    await newCategory.save();
    res.status(201).json({
      success: true,
      message: `${categoryType} category created successfully.`,
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating category.", error });
  }
};
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();  // Get all categories (education, experience, jobCategory)
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully.",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching categories.", error });
  }
};
export const updateCategory = async (req: Request, res: Response) => {
  const { categoryType, item } = req.body;

  try {
    const category = await Category.findOne({ categoryType });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    // Add the new item to the existing items array
    category.items.push(item);

    await category.save();
    res.status(200).json({
      success: true,
      message: `${categoryType} category updated successfully.`,
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating category.", error });
  }
};
export const deleteCategoryItem = async (req: Request, res: Response) => {
  const { categoryType, item } = req.body;

  try {
    const category = await Category.findOne({ categoryType });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    // Remove the item from the category
    category.items = category.items.filter(i => i !== item);

    await category.save();
    res.status(200).json({
      success: true,
      message: `${item} removed from ${categoryType} category.`,
      data: category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error removing category item.", error });
  }
};
