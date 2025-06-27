import mongoose from "mongoose";
import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCategory = asyncHandler(async(req,res)=>{
    const {name} =req.body;

    if(!name?.trim()){
        throw new ApiError(400,"Category name is required");
    }
    const existingCategory = await Category.findOne({name:name.trim().toLowerCase()});
    if(existingCategory){
        throw new ApiError(400,"Category already exists");
    }

    const category = await Category.create({name :name.trim().toLowerCase()});

    return res
    .status(201)
    .json(new ApiResponse(201,category,"Category created successfully"));
});

const getAllCategories = asyncHandler(async(req,res)=>{
    const categories = await Category.find().sort({createdAt:-1});

    return res.status(200)
    .json(new ApiResponse(200,categories,"All categories fetched successfully"))
});

const getCategoryById = asyncHandler(async (req,res)=>{
    const {categoryId} = req.params;

    if(!mongoose.Types.ObjectId.isValid(categoryId)){
        throw new ApiError(400,"Invalid category Id");
    }
    const category = await Category.findById(categoryId);
    if(!category){
        throw new ApiError(404,"Category not found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, category, "Category fetched successfully"));
})
const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  if (!name?.trim()) {
    throw new ApiError(400, "Category name is required");
  }

  const existingCategory = await Category.findOne({ name: name.trim().toLowerCase() });
  if (existingCategory && existingCategory._id.toString() !== categoryId) {
    throw new ApiError(400, "Category name already in use");
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { $set: { name: name.trim().toLowerCase() } },
    { new: true }
  );

  if (!updatedCategory) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCategory, "Category updated successfully"));
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const deleted = await Category.findByIdAndDelete(categoryId);

  if (!deleted) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
