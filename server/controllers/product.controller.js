import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const createProduct = asyncHandler(async (req, res) => {
  const { product_id, title, description, price, category } = req.body;

  
  if (
    [product_id, title, description, category].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!price || isNaN(price) || price <= 0) {
    throw new ApiError(400, "Valid price is required");
  }

  // Check for duplicate product ID
  const existedProduct = await Product.findOne({ product_id });
  if (existedProduct) {
    throw new ApiError(400, "Product with this ID already exists");
  }

  // Check if file was uploaded
  const coverImagePath = req.file?.path;
  if (!coverImagePath) {
    throw new ApiError(400, "Cover image is required");
  }

  // Upload to Cloudinary
  const image = await uploadOnCloudinary(coverImagePath);
  if (!image?.secure_url) {
    throw new ApiError(500, "Image upload failed");
  }

  // Create Product
  const product = await Product.create({
    product_id,
    title,
    description,
    images: {
      url: image.secure_url,
      public_id: image.public_id,
    },
    price,
    category,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

// ================= GET ALL PRODUCTS =================
const getProducts = asyncHandler(async (_, res) => {
  const products = await Product.find({}).lean();
  return res
    .status(200)
    .json(new ApiResponse(200, products, "All products fetched successfully"));
});

// ================= GET PRODUCT BY ID =================
const getproductbyId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Add debugging logs
  console.log('Received product ID:', id);
  console.log('Route params:', req.params);
  console.log('Full request URL:', req.originalUrl);
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('Invalid ObjectId:', id);
    throw new ApiError(400, "Invalid product ID");
  }
  
  console.log('Searching for product with ID:', id);
  const product = await Product.findById(id);
  
  console.log('Product found:', product);
  console.log('Product type:', typeof product);
  console.log('Is product an array?', Array.isArray(product));
  
  if (!product) {
    console.log('Product not found for ID:', id);
    throw new ApiError(404, "Product not found");
  }
  
  console.log('Sending response with product:', product);
  
  // FIXED: Correct parameter order - (statusCode, message, data)
  return res
    .status(200)
    .json(new ApiResponse(200, "Product fetched successfully", product));
});

// ================= UPDATE PRODUCT =================
const updateProducts = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { title, description, price, category } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  if (!price || isNaN(price) || price <= 0) {
    throw new ApiError(400, "Valid price is required");
  }

  const updateDetails = {};
  if (title) updateDetails.title = title.trim();
  if (description) updateDetails.description = description.trim();
  if (price) updateDetails.price = Number(price);
  if (category) updateDetails.category = category.trim();

  if (Object.keys(updateDetails).length === 0) {
    throw new ApiError(400, "At least one field must be provided to update");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: updateDetails },
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(400, "Product could not be updated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

// ================= DELETE PRODUCT =================
const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const deletedProduct = await Product.findByIdAndDelete(productId);
  if (!deletedProduct) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedProduct, "Product deleted successfully"));
});

// ================= EXPORTS =================
export {
  createProduct,
  getProducts,
  getproductbyId,
  updateProducts,
  deleteProduct,
};
