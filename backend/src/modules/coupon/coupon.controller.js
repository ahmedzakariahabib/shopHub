import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { AppError } from "../../utils/AppError.js";
import { couponModel } from "../../../database/models/coupon.model.js";
import { deleteOne } from "../handlers/handlers.js";
const addCoupon = catchError(async (req, res, next) => {
  let isCouponExist = await couponModel.findOne({
    code: req.body.code,
  });
  if (isCouponExist) return next(new AppError("coupon already Exists"));

  let coupon = new couponModel(req.body);
  console.log(coupon);
  await coupon.save();
  res.json({ message: "success", coupon });
});

const getAllCoupons = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(couponModel.find(), req.query)
    .pagination()
    .fields()
    .sort()
    .search()
    .filter();

  let coupon = await apiFeatures.mongooseQuery;

  res.json({ message: "success", page: apiFeatures.pageNumber, coupon });
});

const getSingleCoupon = catchError(async (req, res, next) => {
  let coupon = await couponModel.findById(req.params.id);
  !coupon && next(new AppError("coupon not found", 404));
  coupon && res.json({ message: "success", coupon });
});

const updateCoupon = catchError(async (req, res, next) => {
  let coupon = await couponModel.findByIdAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    {
      new: true,
    }
  );
  !coupon && next(new AppError("coupon not found", 404));
  coupon && res.json({ message: "success", coupon });
});

const deleteCoupon = deleteOne(couponModel);

export {
  addCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
};
