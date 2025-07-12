import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../../utils/AppError.js";

const fileUpload = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() + "-" + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError("images only", 401), false);
    }
  }

  const upload = multer({ storage, fileFilter });
  return upload;
};
export const uploadSingleFile = (fieldName) => fileUpload().single(fieldName);
export const uploadArrayOfFiles = (fieldName) =>
  fileUpload().array(fieldName, 10);
export const uploadFields = (fields) => fileUpload().fields(fields);
