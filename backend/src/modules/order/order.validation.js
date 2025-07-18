import Joi from "joi";
const createOrderVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  shippingAddress: Joi.object({
    street: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
  }).required(),
});

const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const updateQTYVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().options({ convert: false }).required(),
});

export { createOrderVal, paramsIdVal, updateQTYVal };
