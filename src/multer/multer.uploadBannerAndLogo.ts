import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ApiError from "../errors/ApiError";

// Storage configuration for handling logo and banner
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = '';

    // Determine the folder destination based on field name
    if (file.fieldname === 'logo') {
      uploadPath = 'uploads/logos/';
    } else if (file.fieldname === 'banner') {
      uploadPath = 'uploads/banners/';
    }

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for logo (only allow specific image types)
const logoFileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|webp|avif/; // Accepted file types for logos
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType && extname) {
    return cb(null, true); // Accept the file
  } else {
    return cb(new ApiError(400, 'Invalid file type for logo. Allowed types: JPG, PNG, WebP, AVIF.'));
  }
};

// File filter for banner (only allow specific image types)
const bannerFileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|webp|avif/; // Accepted file types for banners
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (mimeType && extname) {
    return cb(null, true); // Accept the file
  } else {
    return cb(new ApiError(400, 'Invalid file type for banner. Allowed types: JPG, PNG, WebP, AVIF.'));
  }
};

// File size limit (5MB for logos, 10MB for banners)
const logoUpload = multer({
  storage: storage,
  fileFilter: logoFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB size limit for logo
}).single('logo');

const bannerUpload = multer({
  storage: storage,
  fileFilter: bannerFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB size limit for banner
}).single('banner');

// Combined upload for both logo and banner at once
const uploadFields = multer({
  storage: storage,
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.fieldname === 'logo') {
      return logoFileFilter(req, file, cb);
    } else if (file.fieldname === 'banner') {
      return bannerFileFilter(req, file, cb);
    } else {
      return cb(new ApiError(400, 'Invalid field name.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for any file
}).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]);

// Export the upload fields middleware
export { uploadFields, logoUpload, bannerUpload };
