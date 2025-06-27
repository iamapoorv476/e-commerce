import { User } from "../models/user.model.js";

import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenandRefreshToken = async(userId) =>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return{accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(500,"Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async (req,res)=>{
    const {name,email,password} = req.body

    if(
        [name,email,password].some((field)=> field?.trim()==="")
    )
    {
        throw new ApiError(400,"All fields are required")
    }
    const existedUser = await User.findOne({
        $or:[{name},{email}]
    })
    if(existedUser){
        throw new ApiError(400 ,"user already exist")
    }

    const user = await User.create({
        name:name.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password "

    )
    if(!createdUser){
        throw new ApiError(500,"something went wrong in server!")
    }

   return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
   )


})
const loginUser = asyncHandler(async(req,res)=>{
    const{email,password} = req.body;

    if(!email  || !password){
        throw new ApiError(400,"User does not exist!")
    }
    const loggedInUser = await User.findOne({
        $or :[{email}]
    })
    if(!loggedInUser){
        throw new ApiError(400,"User does not exist")

    }
    const isPasswordValid = await loggedInUser.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"invalid credentials")
    }
    const{accessToken,refreshToken} = await generateAccessTokenandRefreshToken(loggedInUser._id)
    const loggedIn = await User.findById(user._id).select("-password -refreshToken")

     const options ={
        httpOnly:true,
        secure :true
     }
     return res
     .status(200)
      .cookie("accessToken",accessToken, options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(
        200,
        {
            user : loggedIn ,accessToken,refreshToken
        },
        "User logged in Successfullly!"
    )
   )
   

   })
   const changeOldPassword = asyncHandler(async(req,res)=>{
    const{oldPassword,newPassword} = req.body
    const user = await User.findById(user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old password")
    }
    user.password = newPassword
    await user.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"password changed successfully")
    )
    


        

    


})
const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(
        200,req.user,"current user fetched successfullly"))
})

export {
    registerUser,
    loginUser,
    changeOldPassword,
    getCurrentUser
}