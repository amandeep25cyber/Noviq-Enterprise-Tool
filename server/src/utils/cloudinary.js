import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(fileName, rType = "auto") =>{
    try {
        const response = await cloudinary.uploader.upload(fileName,{
            resource_type: rType,
        });
        fs.unlinkSync(fileName);
        return response;
    } catch (error) {
        console.log(error);
        if(fileName && fs.existsSync(fileName)){
            fs.unlinkSync(fileName);
        }
    }
}

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
    try {
        if (!publicId) {
            console.log("No public ID provided for deletion.");
            return null;
        }

        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });

        console.log(`Cloudinary Delete Result for ${publicId}:`, response.result);

        return response;

    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error?.message);
        return null;
    }
};

export {
    uploadOnCloudinary,
    deleteFromCloudinary,
}