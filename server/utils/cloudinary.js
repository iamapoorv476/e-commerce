import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    const uploadOnCloudinary = async(localFilePath)=>{
        try{
            if(!localFilePath){
                return null;
            }
            const response = await cloudinary.uploader.upload(localFilePath ,{
                resource_type:"auto"
            })
            fs.unlinkSync(localFilePath)
            return response;
        }
        catch(error){
           if (fs.existsSync(localFilePath)) {
    fs.unlinkSync(localFilePath);
}
        }
    }
    
    export const deleteFromCloudinary = async (public_id)=>{
        try {
            if(!public_id) return null
           
            
            const response = await cloudinary.uploader
            .destroy(public_id).then((res)=>{
                // log("assert delete", res)
            });
        } catch (error) {
            console.error("Cloudinary error on deleting assert:", error);
            return null
        }
    }
    export {uploadOnCloudinary}
    
