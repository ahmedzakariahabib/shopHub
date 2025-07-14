import express from "express";
import { signin, signup } from "./auth.controller.js";
import { signinVal, signupVal } from "./auth.validation.js";
import { validation } from "../../middleware/validation.js";
import { checkEmail } from "../../middleware/checkEmail.js";
const authRouter = express.Router();

authRouter.post("/signup", validation(signupVal), checkEmail, signup);
authRouter.post("/signin", validation(signinVal), signin);

export default authRouter;
