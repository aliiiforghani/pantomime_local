const createHttpError = require("http-errors");
const Joi = require("joi");

const categoryValidator = Joi.object({
    title: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .valid(...["سه کلمه ای","دو کلمه ای","تک کلمه ای", "همه", "جمله", "ضرب المثل", "شعر"])
    .required()
    .error(createHttpError.BadRequest("عنوان انتخابی درست نیست")),
})
module.exports = {
    categoryValidator
}