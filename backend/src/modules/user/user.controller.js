import { catchError } from "../../middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { userModel } from "../../../database/models/user.model.js";
const addUser = catchError(async (req, res, next) => {
  let user = new userModel(req.body);
  console.log(user);
  await user.save();
  res.json({
    message: "success",
    // user: { name: user.name, email: user.email },
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
  !user && res.status(404).json({ message: "user not found" });
  user && res.json({ message: "success", user });
});

const updateUser = catchError(async (req, res, next) => {
  let user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  !user && res.status(404).json({ message: "user not found" });
  user && res.json({ message: "success", user });
});

const deleteUser = deleteOne(userModel);
export { addUser, getAllUsers, getSingleUser, updateUser, deleteUser };
