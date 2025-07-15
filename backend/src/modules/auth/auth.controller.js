import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { userModel } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../../src/utils/AppError.js";
const signup = catchError(async (req, res) => {
  let user = new userModel(req.body);
  await user.save();
  let token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_KEY
  );
  // sendEmail(req.body.email);
  res.json({ message: "success", token });
});

const signin = catchError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    let token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY
    );
    return res.json({ message: "success", token });
  }
  // res.json({ message: "incorret email or password" });

  next(new AppError("incorret email or password", 401));
});

const changePassword = catchError(async (req, res, next) => {
  let user = await userModel.findById(req.user._id);
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    let token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY
    );
    await userModel.findByIdAndUpdate(req.user._id, {
      password: req.body.newPassword,
      passwordChangedAt: Date.now(),
    });
    return res.json({ message: "success", token });
  }

  next(new AppError("incorret email or password", 401));
});

const protectedRoutes = catchError(async (req, res, next) => {
  let { token } = req.headers;
  //1.token is exist or not
  if (!token) return next(new AppError("token not provided", 401));
  //2.verify token
  let decoded = jwt.verify(token, process.env.JWT_KEY);
  //3.userId->exist or not
  let user = await userModel.findById(decoded.userId);
  if (!user) return next(new AppError("user not found", 404));
  if (user.passwordChangedAt) {
    //time return with milliseconds i want with seconds because i will compare it with decoded.iat and this time with seconds
    let time = parseInt(user?.passwordChangedAt.getTime() / 1000);
    if (time > decoded.iat)
      return next(new AppError("invalid token..login again", 401));
  }
  req.user = user;
  next();
});

const allowedTo = (...roles) => {
  return catchError(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("you are not authorized."));
    next();
  });
};

// const verify = catchError(async (req, res, next) => {
//   jwt.verify(req.params.token, process.env.JWT_KEY, async (err, decoded) => {
//     if (err) return next(new AppError(err, 401));

//     await userModel.findOneAndUpdate(
//       { email: decoded.email },
//       { verifyEmail: true }
//     );
//     res.json({ message: "success" });
//   });
// });

export { signup, signin, changePassword, protectedRoutes, allowedTo };
