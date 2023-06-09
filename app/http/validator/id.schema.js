const createHttpError = require("http-errors");
const Joi = require("joi");
const { MongoIDPattern } = require("../../utils/constans");


const idValidator = Joi.object({
    id: Joi.string().pattern(new RegExp(MongoIDPattern))
    .error(createHttpError.BadRequest("شناسه وارد شده صحیح نیست")),
})
module.exports = {
    idValidator
}