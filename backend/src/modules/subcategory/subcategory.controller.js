import slugify from "slugify";
import { subcategoryModel } from "../../../database/models/subcategory.model.js";
import { catchError } from "../../middleware/catchError.js";

const addSubCategory = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  let subcategory = new subcategoryModel(req.body);
  console.log(subcategory);
  await subcategory.save();
  res.json({ message: "success", subcategory });
});

const getAllSubCategories = catchError(async (req, res, next) => {
  let subcategories = await subcategoryModel.find({});
  res.json({ message: "success", subcategories });
});

const getSingleSubCategory = catchError(async (req, res, next) => {
  let subcategory = await subcategoryModel.findById(req.params.id);
  !subcategory && res.status(404).json({ message: "subcategory not found" });
  subcategory && res.json({ message: "success", subcategory });
});

const updateSubCategory = catchError(async (req, res, next) => {
  if (req.body.name) req.body.slug = slugify(req.body.name);
  let subcategory = await subcategoryModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  !subcategory && res.status(404).json({ message: "subcategory not found" });
  subcategory && res.json({ message: "success", subcategory });
});

const deleteSubCategory = catchError(async (req, res, next) => {
  let subcategory = await subcategoryModel.findByIdAndDelete(req.params.id);
  !subcategory && res.status(404).json({ message: "subcategory not found" });
  subcategory && res.json({ message: "success", subcategory });
});
export {
  addSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
