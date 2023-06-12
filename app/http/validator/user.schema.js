const createHttpError = require("http-errors");
const Joi = require("joi");

const userRegister = Joi.object({
    username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .error(createHttpError.BadRequest("نام کاربری باید ۴ تا ۳۰ کاراکتر داشته باشد و فقط شامل حروف و اعداد باشد")),
    password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    .error(createHttpError.BadRequest("رمز عبور وارد شده باید شامل حروف کوچک و بزرگ و اعداد باشد")),
})
module.exports = {
    userRegister
}