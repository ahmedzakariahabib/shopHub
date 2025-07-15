import express from "express";
import { validation } from "../../middleware/validation.js";
import {
  addReview,
  deleteReview,
  getAllReviews,
  getSingleReview,
  updateReview,
} from "./review.controller.js";
import {
  addReviewVal,
  paramsIdVal,
  updateReviewVal,
} from "./review.validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .post(protectedRoutes, allowedTo("user"), validation(addReviewVal), addReview)
  .get(getAllReviews);

reviewRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleReview)
  .put(
    protectedRoutes,
    allowedTo("user"),
    validation(updateReviewVal),
    updateReview
  )
  .delete(
    protectedRoutes,
    allowedTo("admin", "user"),
    validation(paramsIdVal),
    deleteReview
  );

export default reviewRouter;
