import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ApiError from "../errors/ApiError";

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'logo') {
      // console.log("got the logo file from multer");
      cb(null, 'uploads/logos/');
    } else if (file.fieldname === 'banner') {
      // console.log("got the banner file from multer");

      cb(null, 'uploads/banners/');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req:any, file:any, cb:any) => {
  const allowedTypes = /jpeg|jpg|png|webp|avif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType && extname) {
    return cb(null, true); // Allow the file if it matches the filter
  } else {
    return cb(new ApiError(400, 'Invalid file type for profile picture. Allowed types: JPG, PNG.'));
  }
};

// Initialize Multer with fields configuration
const uploadLogoAndBanner = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit per file
  }
}).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]);
export { uploadLogoAndBanner };
