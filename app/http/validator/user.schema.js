import createHttpError from "http-errors";
import Joi from "joi";

export const UserLoginValidator = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .error(
      createHttpError.BadRequest(
        "نام کاربری باید ۴ تا ۳۰ کاراکتر داشته باشد و فقط شامل حروف و اعداد باشد"
      )
    ),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .error(
      createHttpError.BadRequest(
        "رمز عبور وارد شده باید شامل حروف کوچک و بزرگ و اعداد باشد"
      )
    ),
});

export const UserRegisterValidator = Joi.object({
  username: Joi.string()
    .alphanum()
    .lowercase()
    .min(3)
    .max(30)
    .required()
    .error(
      createHttpError.BadRequest(
        "نام کاربری باید ۴ تا ۳۰ کاراکتر داشته باشد و فقط شامل حروف و اعداد باشد"
      )
    ),
  first_name: Joi.string()
    .min(2)
    .max(30)
    .required()
    .error(
      createHttpError.BadRequest(
        "نام باید ۳ تا ۳۰ کاراکتر داشته باشد و فقط شامل حروف باشد"
      )
    ),
  last_name: Joi.string()
    .min(2)
    .max(30)
    .required()
    .error(
      createHttpError.BadRequest(
        "نام خانوادگی باید ۳ تا ۳۰ کاراکتر داشته باشد و فقط شامل حروف و اعداد باشد"
      )
    ),
  mobile: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(createHttpError.BadRequest("شماره موبایل وارد شده صحیح نمیباشد")),
  email: Joi.string()
    .email()
    .error(createHttpError.BadRequest("ایمیل وارد شده صحیح نمی باشد")),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(5)
    .max(30)
    .error(
      createHttpError.BadRequest(
        "رمز عبور وارد شده باید شامل حروف کوچک و بزرگ و اعداد باشد و ۶ تا ۳۰ کاراکتر داشته باشد"
      )
    ),
  // confirmPassword: Joi.string()
  //   .valid(Joi.ref("password"))
  //   .required()
  //   .error(createHttpError.BadRequest("رمز عبور و تکرار آن باید یکسان باشند")),
});
