import express from "express";
import { validation } from "../../middleware/validation.js";

import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {
  addAddress,
  getLoggedUserAddress,
  removeAddress,
} from "./address.controller.js";
import { addAddressVal, paramsIdVal } from "./address.validation.js";

const addressRouter = express.Router();

addressRouter
  .route("/")
  .patch(
    protectedRoutes,
    allowedTo("user"),
    validation(addAddressVal),
    addAddress
  )
  .get(protectedRoutes, allowedTo("user"), getLoggedUserAddress);

addressRouter
  .route("/:id")
  .delete(
    protectedRoutes,
    allowedTo("admin", "user"),
    validation(paramsIdVal),
    removeAddress
  );

export default addressRouter;
