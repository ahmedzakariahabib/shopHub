import express from "express";

import { validation } from "../../middleware/validation.js";
import { uploadFields } from "../../services/fileUploads/fileUploads.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "./product.controller.js";
import {
  addProductVal,
  paramsIdVal,
  updateProductVal,
} from "./product.validation.js";
import { protectedRoutes, allowedTo } from "../auth/auth.controller.js";
const productRouter = express.Router();

productRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    uploadFields([
      { name: "imgCover", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    validation(addProductVal),
    addProduct
  )
  .get(getAllProducts);

productRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleProduct)
  .put(
    protectedRoutes,
    allowedTo("admin"),
    uploadFields([
      { name: "imgCover", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    validation(updateProductVal),
    updateProduct
  )
  .delete(
    protectedRoutes,
    allowedTo("admin"),
    validation(paramsIdVal),
    deleteProduct
  );

export default productRouter;
