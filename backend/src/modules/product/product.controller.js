import slugify from "slugify";
import { catchError } from "../../middleware/catchError.js";
import { productModel } from "../../../database/models/product.model.js";
import { deleteOne } from "../handlers/handlers.js";

const addProduct = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  console.log(req.files);
  req.body.imgCover = req.files.imgCover[0].filename;
  req.body.images = req.files.images.map((img) => img.filename);
  let product = new productModel(req.body);
  console.log(product);
  await product.save();
  res.json({ message: "success", product });
});

const getAllProducts = catchError(async (req, res, next) => {
  // pagination
  if (req.query.page <= 0) req.query.page = 1;
  let pageNumber = req.query.page * 1 || 1;
  let pageLimit = 2;
  let skip = (pageNumber - 1) * pageLimit;
  //filter
  let filterObj = { ...req.query };
  // remove page sort fields keyword from filter object
  let excludeFields = ["page", "sort", "fields", "keyword"];
  excludeFields.forEach((val) => delete filterObj[val]);

  filterObj = JSON.stringify(filterObj);
  filterObj = filterObj.replace(/(gt|gte|lt|lte)/g, (match) => "$" + match);
  filterObj = JSON.parse(filterObj);

  let products = await productModel.find(filterObj).skip(skip).limit(pageLimit);
  res.json({ message: "success", page: pageNumber, products });
});

const getSingleProduct = catchError(async (req, res, next) => {
  let product = await productModel.findById(req.params.id);
  !product && res.status(404).json({ message: "product not found" });
  product && res.json({ message: "success", product });
});

const updateProduct = catchError(async (req, res, next) => {
  if (req.body.name) req.body.slug = slugify(req.body.title);
  if (req.files.imgCover) req.body.imgCover = req.files.imgCover[0].filename;
  if (req.files.images)
    req.body.images = req.files.images.map((img) => img.filename);

  let product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  !product && res.status(404).json({ message: "product not found" });
  product && res.json({ message: "success", product });
});

const deleteProduct = deleteOne(productModel);
export {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
