import { Product } from "../models/product.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary";

const createProduct = asyncHandler(async(req,res)=>{
    const {product_id,title,description,price,category,images} = req.body

    if(
       [product_id, title, description, category].some(field => typeof field !== "string" || field.trim() === "")
    )
    {
        throw new ApiError(400,"All fields are required")
    }
    if(!price || isNaN(price) || price <=0){
        throw new ApiError(400,"Valid price is required")
    }
    const existedProduct = await Product.findOne({product_id})
    if(existedProduct){
        throw new ApiError(400,"product with this Id already exist")
    }
    const coverImagePath = req.files?.images?.[0]?.path;
    if(!coverImagePath){
        throw new ApiError(400,"cover image is required")
    }
    const image = await uploadOnCloudinary(coverImagePath)
    if(!image?.secure_url){
        throw new ApiError(500,"cover image is required")
    }
    const product = await Product.create(
        {
            product_id,
            title,
            description,
            images:{
                url:image.secure_url,
                public_id:image.public_id
            },
            price,
            category

        }
    )
    return res
    .status(201)
    .json(
        new ApiResponse(201,product,"product created successfully")
    )

})
const getProducts = asyncHandler(async(_,res)=>{
    const products = await Product.find({}).lean();
    return res
    .status(200)
    .json(
         new ApiResponse(200,products,"All products fetched successfully")
    )
})

const getproductbyId = asyncHandler(async(req,res)=>{
    const {productId} = req.params
    if(!mongoose.Types.ObjectId.isValid(productId)){
        throw new ApiError(400,"invalid product id")
    }
    const product = await Product.findById(productId);
    if(!product){
        throw new ApiError(404,"product not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,product,"product fetched successfully")
    )

})

const updateProducts = asyncHandler(async(req,res)=>{
    const{productId} = req.params
    const{title,description,price,category} = req.body

    if(!mongoose.Types.ObjectId.isValid(productId)){
        throw new ApiError(400,"invalid product id")
    }
    
    if(!price || isNaN(price) || price <=0){
        throw new ApiError(400,"Valid price is required")
    }

    const updatedetails ={}
     if(title) updatedetails.title = title.trim();
     if(description) updatedetails.description = description.trim();
     if(price) updatedetails.price = Number(price);
     if(category) updatedetails.category = category.trim();
     if (Object.keys(updatedetails).length === 0) {
    throw new ApiError(400, "At least one field must be provided to update");
  }

    const updateProduct = await Product.findByIdAndUpdate(
        productId,
        
           {$set : updatedetails},

       
        {new:true}
    )
    if(!updateProduct){
        throw new ApiError(400 ,"Product could not be updated")
    }
    return res
    .status(200)
    .json(
         new ApiResponse(200,updateProduct,"Product updated successfully")
    )

})

const deleteProduct = asyncHandler(async(req,res)=>{
    const {productId} = req.params
    if(!mongoose.Types.ObjectId.isValid(productId)){
        throw new ApiError(400,"Invalid product id")
    }
   const deletedProduct = await Product.findByIdAndDelete(productId)
   if(!deleteProduct){
    throw new ApiError(404,"product not found")
   }
    return res
    .status(200)
    .json(
        new ApiResponse(200,deletedProduct,"The product deleted successfully")
    )
})

export {
    createProduct,
    getProducts,
    getproductbyId,
    updateProducts,
    deleteProduct
}