import {asyncHandeler} from "../utils/asyncHandeler.js"
import {apiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnClodinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
const registerUser=asyncHandeler( async(req,res)=>{
                //  get users details from frontend
                //  validation -not empty
                //  check if user alredy exists:username and email
                //  check for images 
                //  check for avarthar:compulsary
                //  upload them to cloudinary,avathar
                //  create user object - create entry in DB
                //  remove password and refresh token field from resoponse
                //  check for user creation 
                //  return res


    const{username,email,fullname,password}=req.body

    if ( [fullname, email, username ,password].some((field)=>{
        field?.trim()===""
    })) {
        throw new apiError(400,"All fields are required")
    }

   const existedUser= User.findOne({
        $or:[username,email]
    })
    if(existedUser){
        throw new apiError(409,"user existed alredy")
    }
         const avatharLocalPath=req.files?.avathar[0]?.path
        const coverImageLocalPath=req.files?.coverImage[0]?.path
    if (!avatharLocalPath) {
        throw new apiError(400,"avathar file is required")
    }
    const avathar=await uploadOnClodinary(avatharLocalPath)
    const coverImage=await uploadOnClodinary(coverImageLocalPath)
    if(!avathar){
        throw new apiError(400,"avathar file is required")
    }
       const user= await User.create({
            email,
            fullname,
            username:username.toLowerCase(),
            avathar:avathar.url,
            coverImage:coverImage?.url || "",
            password
        })

        const createdUser=awaitUser.findById(user._id).select(
            "-password -refreshToken"
        )
        if (!createdUser) {
            throw new apiError(400,"something went wrong while registering user")
        }
        return res.status(201).json(
            new ApiResponse (200,createdUser,"user registered successfully")
        )

} )



export {registerUser}