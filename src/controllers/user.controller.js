// controllers/user.controller.js
import { asyncHandeler } from '../utils/asyncHandeler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnClodinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken"
import { response } from 'express';
// import { response } from 'express';
// 
const generateAccessAndRefreshToken=async(userid)=>{
try {
    const user=await user.findById(userid)
    const accessToken=user.generateAccessToken()
     const refreshToken=user.generateRefreshToken()
     user.refreshToken=refreshToken
     await user.save({ validateBeforeSave:false })
     return {accessToken,refreshToken}
} catch (error) {
    throw new ApiError(400,"something went wronng while generateAccess And RefreshToken tokens")
}
}



const registerUser = asyncHandeler( async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res


  const {fullName, email, username, password } = req.body
  //console.log("email: ", email);

  if (
      [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
      throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
      $or: [{ username }, { email }]
  })

  if (existedUser) {
      throw new ApiError(409, "User with email or username already exists")
  }
  //console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path
  }
  

  if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required")
  }

  const avatar = await uploadOnClodinary(avatarLocalPath)
  const coverImage = await uploadOnClodinary(coverImageLocalPath)

  if (!avatar) {
      throw new ApiError(400, "Avatar file is required")
  }
 

  const user = await User.create({
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email, 
      password,
      username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
  )

  if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user")
  }
  console.log('User registered successfully:', createdUser);
  return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered Successfully")
  )

} )

const loginUser = asyncHandeler(async(req,res)=>{
    const {username,password,email}=req.body;
    if (! username || ! email) {
        throw new ApiError(400,"At least one is required")
    }
    const user=await User.findOne({
        $or:[{username},{email}]})
if(!user){
    throw new ApiError(400,"user is not on is db")
}
const isPasswordValid = await User.isPasswordCorrect(password)
if(!isPasswordValid){
    throw new ApiError(400,"Password invalid ")
}
const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
const options={
    httpOnly:true,
    secure:true
}
return res.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(new ApiResponse(200,
    {
    user:loggedInUser,refreshToken,accessToken
    }
    ,"user logged in successfully")
    )
})

const logOutUser=asyncHandeler(async(req,res)=>{
    User.findByIdAndUpdate(req.user._id,
        {
        $set:{
            refreshToken:undefined
        }
        },
        {
        new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"uer loggoed out successfully"))
})
 const refreshAccessToken=asyncHandeler(async(req,res)=>{
    const incomingRefeshToken=req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefeshToken) {
     throw new ApiError(400,"unauthorized request")    
    }
    const decodedRefreshToken=jwt.verify(incomingRefeshToken,process.env.REFRESH_TOKEN_SECRET)
    const user=User.findById(decodedRefreshToken._id)
    if (!user) {
        throw new ApiError(400,"invalid refreshtoken")
    }
    if (incomingRefeshToken !== user?.refreshToken) {
        throw new ApiError(400,"invalid refresh token or expired")
    }
     const {accessToken,newRewrefreshToken}=await generateAccessAndRefreshToken(user._id)
    const options={
        httpOnly:true,
        secure:true
     }
     return res.status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newRewrefreshToken,options)
     .json(new ApiResponse(200,
        {
           accessToken,newRewrefreshToken 
        },"access token refreshed"
     ))
     

 })
 



export { registerUser,loginUser,logOutUser,refreshAccessToken };
