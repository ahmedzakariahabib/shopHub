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
  let pageLimit = 9;
  let skip = (pageNumber - 1) * pageLimit;
  //filter
  //here add spread operator to make change in filterObj without changing req.query
  //  بيشاور عليهم الاتنينreference  عشان هنا طلاما اخذت اوبجت من حاجه فى التغير فى واحده بيأثر على التانيه عشان نفس
  let filterObj = { ...req.query };
  // remove page sort fields keyword from filter object
  let excludeFields = ["page", "sort", "fields", "keyword"];
  excludeFields.forEach((val) => delete filterObj[val]);

  filterObj = JSON.stringify(filterObj);
  filterObj = filterObj.replace(/(gt|gte|lt|lte)/g, (match) => "$" + match);
  filterObj = JSON.parse(filterObj);
  //building query
  let mongooseQuery = productModel.find(filterObj).skip(skip).limit(pageLimit);
  //sort
  if (req.query.sort) {
    let sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    mongooseQuery.sort(sortBy);
  }
  //fields
  if (req.query.fields) {
    let fields = req.query.fields.split(",").join(" ");
    console.log(fields);
    mongooseQuery.select(fields);
  }

  //search
  if (req.query.keyword) {
    mongooseQuery.find({
      $or: [
        { title: { $regex: req.query.keyword } },
        { description: { $regex: req.query.keyword } },
      ],
    });
  }
  //Excute query
  let products = await mongooseQuery;
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
