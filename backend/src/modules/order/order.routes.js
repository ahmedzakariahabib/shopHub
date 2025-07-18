import express from "express";
import { validation } from "../../middleware/validation.js";

import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { createOrderVal } from "./order.validation.js";
import {
  createCashOrder,
  createCheckOutSession,
  getAllOrders,
  getSpecificOrder,
} from "./order.controller.js";

const orderRouter = express.Router();
orderRouter
  .route("/")
  .get(protectedRoutes, allowedTo("user"), getSpecificOrder);

orderRouter
  .route("/:id")
  .post(
    protectedRoutes,
    allowedTo("user"),
    validation(createOrderVal),
    createCashOrder
  );
orderRouter.get("/all", protectedRoutes, allowedTo("admin"), getAllOrders);

orderRouter.post(
  "/checkOut/:id",
  protectedRoutes,
  allowedTo("user"),
  createCheckOutSession
);
export default orderRouter;
