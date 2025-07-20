import { catchError } from "../../middleware/catchError.js";
import { userModel } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
const addToWishlist = catchError(async (req, res, next) => {
  //array مفيش اختلاف فى حاله الاوبجكت الاختلاف فى حاله
  //addToSet if item exist in wishlist don't add it again
  //push if item exist in wishlist add it again i don't like this
  //add again even thing same thing in case object
  let wishlist = await userModel
    .findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: req.body.product } },
      {
        new: true,
      }
    )
    .populate("wishlist");
  !wishlist && next(new AppError("wishlist not found", 404));
  wishlist && res.json({ message: "success", wishlist: wishlist.wishlist });
});

const removeFromWishlist = catchError(async (req, res, next) => {
  //pull to remove item from wishlist
  //pop to remove last item you add from wishlist
  let wishlist = await userModel
    .findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: req.params.id } },
      {
        new: true,
      }
    )
    .populate("wishlist");
  !wishlist && next(new AppError("wishlist not found", 404));
  wishlist && res.json({ message: "success", wishlist: wishlist.wishlist });
});

const getLoggedUserWishlist = catchError(async (req, res, next) => {
  let { wishlist } = await userModel
    .findById(req.user._id)
    .populate("wishlist");
  !wishlist && next(new AppError("wishlist not found", 404));
  wishlist && res.json({ message: "success", wishlist });
});

export { addToWishlist, removeFromWishlist, getLoggedUserWishlist };
