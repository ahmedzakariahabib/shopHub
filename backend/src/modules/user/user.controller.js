import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { userModel } from "../../../database/models/user.model.js";
import { sendEmail } from "../../services/emails/sendEmail.js";
import { AppError } from "../../utils/AppError.js";
const addUser = catchError(async (req, res, next) => {
  let user = new userModel(req.body);
  console.log(user);
  await user.save();
  sendEmail(req.body.email);
  res.json({
    message: "success",
    user,
  });
});

const getAllUsers = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(userModel.find(), req.query)
    .pagination()
    .fields()
    .sort()
    .search()
    .filter();
  let users = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.pageNumber, users });
});

const getSingleUser = catchError(async (req, res, next) => {
  let user = await userModel.findById(req.params.id);
  // !user && res.status(404).json({ message: "user not found" });
  !user && next(new AppError("user not found", 404));
  user && res.json({ message: "success", user });
});

const updateUser = catchError(async (req, res, next) => {
  let user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  !user && next(new AppError("user not found", 404));
  user && res.json({ message: "success", user });
});

const deleteUser = catchError(async (req, res, next) => {
  let user = await userModel.findByIdAndDelete(req.params.id);
  !user && next(new AppError("user not found", 404));
  user && res.json({ message: "success", user });
});

export { addUser, getAllUsers, getSingleUser, updateUser, deleteUser };
