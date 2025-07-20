import slugify from "slugify";
import { categoryModel } from "../../../database/models/category.model.js";
import { catchError } from "../../middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { AppError } from "../../utils/AppError.js";

const addCategory = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  req.body.image = req.file.filename;
  let category = new categoryModel(req.body);
  console.log(category);
  await category.save();
  res.json({ message: "success", category });
});

const getAllCategories = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
    .pagination()
    .fields()
    .sort()
    .search()
    .filter();

  let categories = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.pageNumber, categories });
});

const getSingleCategory = catchError(async (req, res, next) => {
  let category = await categoryModel.findById(req.params.id);
  !category && next(new AppError("category not found", 404));
  category && res.json({ message: "success", category });
});

const updateCategory = catchError(async (req, res, next) => {
  if (req.body.name) req.body.slug = slugify(req.body.name);
  if (req.file) req.body.image = req.file.filename;

  let category = await categoryModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  !category && next(new AppError("category not found", 404));
  category && res.json({ message: "success", category });
});

const deleteCategory = deleteOne(categoryModel);
export {
  addCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
