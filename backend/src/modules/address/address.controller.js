import { catchError } from "../../middleware/catchError.js";
import { userModel } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";

const addAddress = catchError(async (req, res, next) => {
  let address = await userModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    {
      new: true,
    }
  );
  console.log(addAddress);
  !address && next(new AppError("address not found", 404));
  address && res.json({ message: "success", address: address.addresses });
});

const removeAddress = catchError(async (req, res, next) => {
  let address = await userModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.params.id } } },
    {
      new: true,
    }
  );

  !address && next(new AppError("address not found", 404));
  address && res.json({ message: "success", address: address.addresses });
});

const getLoggedUserAddress = catchError(async (req, res, next) => {
  let { addresses } = await userModel.findById(req.user._id);
  addresses && res.json({ message: "success", addresses });
});

export { addAddress, removeAddress, getLoggedUserAddress };
