import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config(
    {
        path: './.env'
    }
)

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (file) => {
    try {
        if (!file) return null
        const response = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
        })
        //console.log("File uploaded", response.url);
        fs.unlinkSync(file)
        return response
        
    } catch (error) {
        fs.unlinkSync(file)
        //console.log( "File not uploaded", error)
        return null
    }
}

export { uploadImage }