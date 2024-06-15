import {v2 as cloudinary} from 'cloudinary';
// import { response } from 'express';
import fs from "fs";


   
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_NAME , 
        api_key:process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET 
    });
    
    const uploadOnClodinary=async(localFilePath)=>{
        try {
            if(!localFilePath) return null;
            //upload the file on cloudinary
           const resp= await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            console.log("file uploaded on cloudinary ",resp.url);
            return resp;
        } catch (error) {
            fs.unlinkSync(localFilePath) // remove the locally saved temparory file as upload operation gone failed
        }
    }

    export {uploadOnClodinary}