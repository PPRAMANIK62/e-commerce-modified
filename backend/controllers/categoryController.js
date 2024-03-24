import asyncHandler from "../middlewares/asyncHandler.js";
import Category from "../models/categoryModel.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Please enter a category name" });
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const category = await new Category({ name }).save();
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    return res.status(404).json(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.name = name;

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    return res.status(404).json(error);
  }
});

const removeCategory = asyncHandler(async (req, res) => {
  try {
    const removed = await Category.findByIdAndDelete(req.params.categoryId);
    res.status(200).json(removed);
  } catch (error) {
    console.error(error);
    return res.status(404).json(error);
  }
});

const listCategory = asyncHandler(async (req, res) => {
  try {
    const all = await Category.find({});
    res.json(all);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

const getCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById({ _id: req.params.categoryId });
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    return res.status(404).json(error);
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  getCategory,
};
