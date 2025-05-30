const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (base64Image, folder = "others") => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder,
      resource_type: "image",
    });
    return result.url;
  } catch (error) {
    throw new Error("Cloudinary upload failed");
  }
};

const deleteImage = async (folder, publicId) => {
  return await cloudinary.uploader.destroy(`${folder}/${publicId}`);
};

module.exports = {
  uploadImage,
  deleteImage,
};
