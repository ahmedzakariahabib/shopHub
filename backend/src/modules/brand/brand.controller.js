import slugify from "slugify";
import { catchError } from "../../middleware/catchError.js";
import { brandModel } from "../../../database/models/brand.model.js";

const addBrand = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  req.body.logo = req.file.filename;
  let brand = new brandModel(req.body);
  console.log(brand);
  await brand.save();
  res.json({ message: "success", brand });
});

const getAllBrands = catchError(async (req, res, next) => {
  let Brands = await brandModel.find({});
  res.json({ message: "success", Brands });
});

const getSingleBrand = catchError(async (req, res, next) => {
  let brand = await brandModel.findById(req.params.id);
  !brand && res.status(404).json({ message: "brand not found" });
  brand && res.json({ message: "success", brand });
});

const updateBrand = catchError(async (req, res, next) => {
  if (req.body.name) req.body.slug = slugify(req.body.name);
  if (req.file) req.body.logo = req.file.filename;
  let brand = await brandModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  !brand && res.status(404).json({ message: "brand not found" });
  brand && res.json({ message: "success", brand });
});

const deleteBrand = catchError(async (req, res, next) => {
  let brand = await brandModel.findByIdAndDelete(req.params.id);
  !brand && res.status(404).json({ message: "brand not found" });
  brand && res.json({ message: "success", brand });
});
export { addBrand, getAllBrands, getSingleBrand, updateBrand, deleteBrand };
