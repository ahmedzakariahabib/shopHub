import Joi from "joi";
const signupVal = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
    }),
  rePassword: Joi.valid(Joi.ref("password")).required().messages({
    "any.only": "rePassword do not match with password",
  }),
});

const signinVal = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
    }),
});

const changePasswordVal = Joi.object({
  password: Joi.string()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .messages({
      "string.pattern.base":
        "old Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
    }),
  newPassword: Joi.string()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .messages({
      "string.pattern.base":
        "new Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
    }),
});

export { signupVal, signinVal, changePasswordVal };
