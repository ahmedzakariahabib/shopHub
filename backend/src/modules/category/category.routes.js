import express from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "./category.controller.js";
import {
  addCategoryVal,
  paramsIdVal,
  updateCategoryVal,
} from "./category.validation.js";
import { validation } from "../../middleware/validation.js";
import { uploadSingleFile } from "../../services/fileUploads/fileUploads.js";

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .post(uploadSingleFile("img"), validation(addCategoryVal), addCategory)
  .get(getAllCategories);

categoryRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleCategory)
  .put(uploadSingleFile("img"), validation(updateCategoryVal), updateCategory)
  .delete(validation(paramsIdVal), deleteCategory);

export default categoryRouter;
