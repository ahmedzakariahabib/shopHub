import { catchError } from "../../middleware/catchError.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { reviewModel } from "../../../database/models/review.model.js";
import { userModel } from "../../../database/models/user.model.js";
import { AppError } from "../../utils/AppError.js";
const addReview = catchError(async (req, res, next) => {
  req.body.user = req.user._id;
  let isReviewExist = await reviewModel.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (isReviewExist) {
    return next(new AppError("you created a Review Before"));
  }
  let review = new reviewModel(req.body);
  console.log(review);
  await review.save();
  res.json({ message: "success", review });
});

const getAllReviews = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(reviewModel.find(), req.query)
    .pagination()
    .fields()
    .sort()
    .search()
    .filter();

  let reviews = await apiFeatures.mongooseQuery;

  res.json({ message: "success", page: apiFeatures.pageNumber, reviews });
});

const getSingleReview = catchError(async (req, res, next) => {
  let review = await reviewModel.findById(req.params.id);
  !review && next(new AppError("review not found", 404));
  review && res.json({ message: "success", review });
});

const updateReview = catchError(async (req, res, next) => {
  let review = await reviewModel.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    {
      new: true,
    }
  );
  !review && next(new AppError("review not found", 404));
  review && res.json({ message: "success", review });
});

const deleteReview = catchError(async (req, res, next) => {
  const user = await userModel.findOne({ _id: req.user._id });

  if (user.role === "admin") {
    let review = await reviewModel.findByIdAndDelete(req.params.id);
    !review && next(new AppError("review not found", 404));
    review && res.json({ message: "success", review });
  } else {
    let review = await reviewModel.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    !review && next(new AppError("review not found", 404));
    review && res.json({ message: "success", review });
  }
});

export {
  addReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
