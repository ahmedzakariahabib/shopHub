import express from "express";
import { validation } from "../../middleware/validation.js";
import { addUserVal, paramsIdVal, updateUserVal } from "./user.validation.js";
import {
  addUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} from "./user.controller.js";
import { checkEmail } from "../../middleware/checkEmail.js";
import { protectedRoutes, allowedTo } from "../auth/auth.controller.js";
const userRouter = express.Router();

userRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("admin"),
    validation(addUserVal),
    checkEmail,
    addUser
  )
  .get(protectedRoutes, allowedTo("admin"), getAllUsers);

userRouter
  .route("/:id")
  .get(
    protectedRoutes,
    // allowedTo("admin"),
    allowedTo("admin", "user"),
    validation(paramsIdVal),
    getSingleUser
  )
  .put(
    protectedRoutes,
    allowedTo("admin"),
    validation(updateUserVal),
    updateUser
  )
  .delete(
    protectedRoutes,
    allowedTo("admin"),
    validation(paramsIdVal),
    deleteUser
  );

export default userRouter;
