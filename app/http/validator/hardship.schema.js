const createHttpError = require("http-errors");
const Joi = require("joi");

const hardShipValidator = Joi.object({
    title: Joi.string()
    .trim()
    .required()
    .error(createHttpError.BadRequest("عنوان انتخابی درست نیست")),
})
module.exports = {
    hardShipValidator
}