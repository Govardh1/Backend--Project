import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const verifyJWT= async(req, _ ,next)=>{
try {
    const token=req.cokkies?.accessToken ||req.header("Authorization")?.replace("Beared ","")
    if (!token) {
        throw new ApiError(401,"unauthorized request")
    }
    
    const decodedToken=await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     const  user=await User.findById(decodedToken?._id).select("-password -refreshToken")
    if (!user) {
        throw new ApiError(401,"user not existed invalid access")
    }
    
    
    req.user=user;
    next()
} catch (error) {
    throw new ApiError(401,"error from verifyJwt")
}

}