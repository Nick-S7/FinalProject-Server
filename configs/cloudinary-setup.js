// this is the cloudinary.v2 method. use this import and make necessary changes if original cloudinary method does not work
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// This is the original cloudinary method. Try to use this method first and if your having upload issues, then try cloudinary.v2 method of upload
// const cloudinary = require("cloudinary");
// const cloudinaryStorage = require("multer-storage-cloudinary");

const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// const storage = cloudinaryStorage({
// this is what you use for original cloudinary method
const storage = new CloudinaryStorage({
  // use this line for cloudinary.v2 method
  cloudinary: cloudinary,

  // folder: "spots",
  // allowedFormats: ["jpg", "png"],

  // both original and .v2 method can use the updated params to call the folder and allowedFormat. *Use this from now on*
  params: {
    folder: "spots",
    allowedFormats: ["jpg", "png"],
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
