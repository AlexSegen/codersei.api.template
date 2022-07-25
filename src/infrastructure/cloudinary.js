const config = require("../config");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
	cloud_name: config.cloudinary.cloud,
	api_key: config.cloudinary.key,
	api_secret: config.cloudinary.secret
});

const storage = cloudinaryStorage({
	cloudinary: cloudinary,
	folder: config.cloudinary.folder,
	allowedFormats: ["jpg", "png"],
	transformation: [{ width: 500, height: 500, crop: "limit" }]
});

const parser = multer({ storage });

module.exports = parser;