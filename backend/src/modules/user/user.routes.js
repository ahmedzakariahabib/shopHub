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
const userRouter = express.Router();

userRouter
  .route("/")
  .post(validation(addUserVal), checkEmail, addUser)
  .get(getAllUsers);

userRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleUser)
  .put(validation(updateUserVal), updateUser)
  .delete(validation(paramsIdVal), deleteUser);

export default userRouter;
