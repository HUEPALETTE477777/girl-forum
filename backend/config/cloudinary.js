const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const cloudinaryUpload = async (file) => {
    try {
        const res = await cloudinary.uploader.upload(file, {
            resource_type: "image",
        });
        return res;
    } catch (err) {
        console.error(err);
    }
}

const cloudinaryVideoUpload = async (file) => {
    try {
        const res = await cloudinary.uploader.upload_large(file, {
            resource_type: "video", 
        })
        return res;
    } catch (err) {
        console.error(err);
    }
}



module.exports = {
    cloudinaryUpload,
    cloudinaryVideoUpload,
};