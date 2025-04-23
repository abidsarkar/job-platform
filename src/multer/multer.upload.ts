import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ApiError from "../errors/ApiError";

// Create an 'uploads' folder if it doesn't exist
const uploadFolder = './public/uploads';

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Configure multer storage and file filtering
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Dynamically set the destination folder based on the file field name
    let folderPath = 'profile_pictures'; // Default to profile_pictures

    if (file.fieldname === 'banner') {
      folderPath = 'banners';
    } else if (file.fieldname === 'cv') {
      folderPath = 'cvs';
    }

    const filePath = path.join(uploadFolder, folderPath);
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    cb(null, filePath); // Save files to respective folders
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`; // Generate unique filename
    cb(null, filename);
  }
});

// File filter for image types (for profile pictures and banners)
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedImageTypes = /jpeg|jpg|png/;
  const allowedDocTypes = /pdf|doc|docx/; // For CV files

  const mimeType = allowedImageTypes.test(file.mimetype) || allowedDocTypes.test(file.mimetype);
  const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) ||
                 allowedDocTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extname) {
    return cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid file type. Allowed types are: JPG, PNG for images and PDF, DOC, DOCX for CV.'));
  }
};

// Limit the size of the uploaded file to 10MB
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for each file
}).fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]); // You can upload profile picture, banner, and CV

export default upload;
