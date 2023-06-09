const createHttpError = require("http-errors");
const Joi = require("joi");
const { MongoIDPattern } = require("../../utils/constans");

const addSentenceValidator = Joi.object({
    title: Joi.string()
    .min(2)
    .max(120)
    .required()
    .error(createHttpError.BadRequest("عنوان  باید ۴ تا ۳۰ کاراکتر داشته باشد و فقط شامل حروف باشد")),
    text: Joi.string()
    .min(3)
    .max(120)
    .required()
    .error(createHttpError.BadRequest("کلمه یا جمله پیشنهادی  باید ۳ تا ۱۲۰ کاراکتر داشته باشد و فقط شامل حروف باشد")),
    hardship: Joi.string()
    .pattern(new RegExp(MongoIDPattern))
    .error(createHttpError.BadRequest("درجه سختی انتخابی درست نیست")),
    category: Joi.string()
    .pattern(new RegExp(MongoIDPattern))
    .error(createHttpError.BadRequest("دسته بندی انتخابی درست نیست")),
})
const adminAddSentenceValidator = Joi.object({
    title: Joi.string()
    .min(2)
    .max(120)
    .required()
    .error(createHttpError.BadRequest("عنوان  باید ۴ تا ۳۰ کاراکتر داشته باشد و فقط شامل حروف باشد")),
    text: Joi.string()
    .min(3)
    .max(120)
    .required()
    .error(createHttpError.BadRequest("کلمه یا جمله پیشنهادی  باید ۳ تا ۱۲۰ کاراکتر داشته باشد و فقط شامل حروف باشد")),
    hardship: Joi.string()
    .pattern(new RegExp(MongoIDPattern))
    .error(createHttpError.BadRequest("درجه سختی انتخابی درست نیست")),
    category: Joi.string()
    .pattern(new RegExp(MongoIDPattern))
    .error(createHttpError.BadRequest("دسته بندی انتخابی درست نیست")),
    published: Joi.string()
    .valid("true", "false")
})
const randomSentenceValidator = Joi.object({
    hardshipId: Joi.string()
    .pattern(new RegExp(MongoIDPattern))
    .allow("").allow('').allow(" ").allow(' ')
    .error(createHttpError.BadRequest("درجه سختی انتخابی درست نیست")),
    categoryId: Joi.string().pattern(new RegExp(MongoIDPattern))
    .allow("").allow('').allow(" ").allow(' ')
    .error(createHttpError.BadRequest("دسته بندی انتخابی درست نیست")),
})
module.exports = {
    addSentenceValidator,
    randomSentenceValidator,
    adminAddSentenceValidator
}