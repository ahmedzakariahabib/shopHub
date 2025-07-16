import Joi from "joi";
const addToCartVal = Joi.object({
  product: Joi.string().hex().length(24).required(),
  //options({convert:false}) to don't convert string number to number and do concat with number are there بل فعل
  quantity: Joi.number().integer().options({ convert: false }),
});

const paramsIdVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const updateQTYVal = Joi.object({
  id: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().options({ convert: false }).required(),
});

export { addToCartVal, paramsIdVal, updateQTYVal };
