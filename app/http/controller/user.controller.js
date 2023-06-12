const createHttpError = require("http-errors");
const { UserModel } = require("../../models/user");
const { userRegister } = require("../validator/user.schema");
const Controller = require("./controller");
const httpstatuscodes = require("http-status-codes");
const { SignAccessToken, SignRefreshToken } = require("../../utils/functions");
const { ONE_DAY, ONE_MOUNTH } = require("../../utils/constans");
const cookie = require("cookie");

class UserController extends Controller {
  async userRegister(req, res, next) {
    try {
      const { first_name, last_name, mobile, username, password } = req.body;
      await userRegister.validateAsync({ username, password });
      const user = await this.checkExistUser(username);
      if (user) throw createHttpError.BadRequest("نام کاربری قبلا ثبت شده است");
      console.log("sdas", mobile);
      const newUser = await UserModel.create({
        username,
        password,
        first_name,
        last_name,
        mobile,
      });
      if (newUser.modifiedCount == 0)
        throw createHttpError.InternalServerError("ثبت نام انجام نشد");
      return res.status(httpstatuscodes.CREATED).json({
        statusCode: httpstatuscodes.CREATED,
        data: {
          message: "ثبت نام شما با موفقیت انجام شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async userLogin(req, res, next) {
    try {
      const { username, password } = req.body;
      console.log(req.body);
      await userRegister.validateAsync(req.body);
      const user = await this.checkExistUser(username);
      if (!user) throw createHttpError.BadRequest("کاربری یافت نشد");
      if (password !== user.password)
        throw createHttpError.Unauthorized("نام کاربری یا رمز عبور اشتباه است");
      const accesstoken = await SignAccessToken(user._id);
      const refreshtoken = await SignRefreshToken(user._id);
      const userInformation = {
        firstname: user.first_name,
        lastname: user.last_name,
      };
      const tokenexpires = 24 * 60 * 60 * 1000;
      const refreshtokenexpires = 30 * 24 * 60 * 60 * 1000;

      return res
        .cookie("accesstoken", accesstoken, {
          domain: ".prorobo.ir",
          signed: true, // Indicates if the cookie should be signed
          maxAge: tokenexpires,
          httpOnly: true, // optional
          secure: true, // optional, set to true if using HTTPS
          sameSite: "strict", // optional, can be 'strict', 'lax', or 'none'
        })
        .status(httpstatuscodes.OK)
        .json({
          statusCode: httpstatuscodes.OK,
          data: {
            message: "با موفقیت وارد شدید",
            accesstoken,
            refreshtoken,
            userInformation,
          },
        });
    } catch (error) {
      next(error);
    }
  }

  async checkExistUser(username) {
    const user = await UserModel.findOne({ username });
    return user;
  }
}

module.exports = {
  userRegisterController: new UserController(),
};
