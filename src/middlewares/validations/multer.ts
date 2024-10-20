import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads'); // Directory where images will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const nameFile = file.originalname.replace(/\s+/g, ''); 
    cb(null, uniqueSuffix + '-' + nameFile); // Append a unique suffix to avoid file name conflicts
  }
});

// File filter to allow only image files
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const filetypes = /jpeg|jpg|png|gif/; // Allowed file extensions

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed!')); // Reject file upload
  }
};

// Multer instance for single image upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
  }
});

export default upload;
