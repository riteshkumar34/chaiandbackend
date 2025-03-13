import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";
import {User} from "../models/user.models";



export const verifyJWT = asyncHandler(async(req,_,next)=>{
    try{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Beare ","")

    if(!token){
        throw new ApiError(401,"Unauthorized reques")
    }

   const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

  const user =  await User.findById(decodedToken?._id).select("-password-refreshToken")

  if(!user){
    //NEXT_VIDEO:discuss abput frontend
    throw new ApiError(401,"Invalid Access Token")
  }

  req.user=user;
  next()
}
catch(err){
  throw new ApiError(401,err?.message||"Invalid access token")  
}
})

