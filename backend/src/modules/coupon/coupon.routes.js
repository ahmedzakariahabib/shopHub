import express from "express";
import { validation } from "../../middleware/validation.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

import {
  addCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
} from "./coupon.controller.js";

import {
  addCouponVal,
  updateCouponVal,
  paramsIdVal,
} from "./coupon.validation.js";

const couponRouter = express.Router();

couponRouter.use(protectedRoutes, allowedTo("admin"));

couponRouter
  .route("/")
  .post(validation(addCouponVal), addCoupon)
  .get(getAllCoupons);
couponRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleCoupon)
  .put(validation(updateCouponVal), updateCoupon)
  .delete(validation(paramsIdVal), deleteCoupon);

export default couponRouter;
