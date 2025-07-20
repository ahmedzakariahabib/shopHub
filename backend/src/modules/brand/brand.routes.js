import express from "express";
import {
  addBrand,
  deleteBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
} from "./brand.controller.js";
import { validation } from "../../middleware/validation.js";
import { uploadSingleFile } from "../../services/fileUploads/fileUploads.js";
import {
  addBrandVal,
  paramsIdVal,
  updateBrandVal,
} from "./brand.validation.js";
import { protectedRoutes, allowedTo } from "../auth/auth.controller.js";
const brandRouter = express.Router();

brandRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("logo"),
    validation(addBrandVal),
    addBrand
  )
  .get(getAllBrands);

brandRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleBrand)
  .put(
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("logo"),
    validation(updateBrandVal),
    updateBrand
  )
  .delete(
    protectedRoutes,
    allowedTo("admin"),
    validation(paramsIdVal),
    deleteBrand
  );

export default brandRouter;
