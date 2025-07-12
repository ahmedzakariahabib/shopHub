import express from "express";
import { validation } from "../../middleware/validation.js";
import {
  addSubCategoryVal,
  paramsIdVal,
  updateSubCategoryVal,
} from "./subcategory.validation.js";
import {
  addSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "./subcategory.controller.js";

const subCategoryRouter = express.Router();

subCategoryRouter
  .route("/")
  .post(validation(addSubCategoryVal), addSubCategory)
  .get(getAllSubCategories);

subCategoryRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleSubCategory)
  .put(validation(updateSubCategoryVal), updateSubCategory)
  .delete(validation(paramsIdVal), deleteSubCategory);

export default subCategoryRouter;
