import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/AppError.js";
import { cartModel } from "../../../database/models/cart.model.js";
import { orderModel } from "../../../database/models/order.model.js";
import { productModel } from "../../../database/models/product.model.js";
const createCashOrder = catchError(async (req, res, next) => {
  //1.get cart -> cartId
  let cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new AppError("product not found", 401));

  //2.total order price
  let totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  //3.create order ->cash
  let order = new orderModel({
    user: req.user._id,
    orderItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  await order.save();
  //4.increment sold & decrement quantity

  let options = cart.cartItems.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod.product },
        update: { $inc: { sold: prod.quantity, quantity: -prod.quantity } },
      },
    };
  });

  await productModel.bulkWrite(options);

  //5.clear cart

  await cartModel.findByIdAndDelete(req.params.id);
  res.json({ message: "success", order });
});

const getSpecificOrder = catchError(async (req, res, next) => {
  let order = await orderModel
    .findOne({ user: req.user._id })
    .populate("orderItems.product");
  res.status(200).json({ message: "success", order });
});

const getAllOrders = catchError(async (req, res, next) => {
  let orders = await orderModel.find({}).populate("orderItems.product");
  res.status(200).json({ message: "success", orders });
});

export { createCashOrder, getSpecificOrder, getAllOrders };
