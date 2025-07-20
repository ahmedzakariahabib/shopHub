import slugify from "slugify";
import { subcategoryModel } from "../../../database/models/subcategory.model.js";
import { catchError } from "../../middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { AppError } from "../../utils/AppError.js";
const addSubCategory = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  let subcategory = new subcategoryModel(req.body);
  console.log(subcategory);
  await subcategory.save();
  res.json({ message: "success", subcategory });
});

const getAllSubCategories = catchError(async (req, res, next) => {
  let filterObj = {};
  if (req.params.category) {
    filterObj.category = req.params.category;
  }

  let apiFeatures = new ApiFeatures(subcategoryModel.find(filterObj), req.query)
    .pagination()
    .fields()
    .sort()
    .search()
    .filter();

  let subcategories = await apiFeatures.mongooseQuery;
  res.json({ message: "success", page: apiFeatures.pageNumber, subcategories });
});

const getSingleSubCategory = catchError(async (req, res, next) => {
  let subcategory = await subcategoryModel.findById(req.params.id);
  !subcategory && next(new AppError("subcategory not found", 404));
  subcategory && res.json({ message: "success", subcategory });
});

const updateSubCategory = catchError(async (req, res, next) => {
  if (req.body.name) req.body.slug = slugify(req.body.name);
  let subcategory = await subcategoryModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  !subcategory && next(new AppError("subcategory not found", 404));
  subcategory && res.json({ message: "success", subcategory });
});

const deleteSubCategory = deleteOne(subcategoryModel);
export {
  addSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
