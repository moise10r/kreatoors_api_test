import multer, { StorageEngine } from "multer";
import path from "path";
import { Request } from "express";

interface FileRequest extends Request {
  file?: Express.Multer.File; // file will be available if a file is uploaded
}

const storage: StorageEngine = multer.diskStorage({
  destination: (req: FileRequest, file, cb) => {
    cb(null, "uploads/"); // Define the folder to store uploaded files
  },
  filename: (req: FileRequest, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname) // Set the filename
    );
  },
});

const upload = multer({ storage: storage });

export { upload };
