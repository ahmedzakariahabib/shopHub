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
import { protectedRoutes, allowedTo } from "../auth/auth.controller.js";
const subCategoryRouter = express.Router({ mergeParams: true });

subCategoryRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    validation(addSubCategoryVal),
    addSubCategory
  )
  .get(getAllSubCategories);

subCategoryRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleSubCategory)
  .put(
    protectedRoutes,
    allowedTo("admin"),
    validation(updateSubCategoryVal),
    updateSubCategory
  )
  .delete(
    protectedRoutes,
    allowedTo("admin"),
    validation(paramsIdVal),
    deleteSubCategory
  );

export default subCategoryRouter;
