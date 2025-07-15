import { catchError } from "../../middleware/catchError.js";
import { userModel } from "../../../database/models/user.model.js";
const addAddress = catchError(async (req, res, next) => {
  let address = await userModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    {
      new: true,
    }
  );

  !address && res.status(404).json({ message: "address not found" });
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

  !address && res.status(404).json({ message: "address not found" });
  address && res.json({ message: "success", address: address.addresses });
});

const getLoggedUserAddress = catchError(async (req, res, next) => {
  let { addresses } = await userModel.findById(req.user._id);
  addresses && res.json({ message: "success", addresses });
});

export { addAddress, removeAddress, getLoggedUserAddress };
