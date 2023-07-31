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
      await UserRegisterValidator.validateAsync(req.body);

      const {
        first_name,
        last_name,
        mobile,
        username,
        password,
        // confirmPassword,
      } = req.body;

      const user = await this.checkExistUser(username);
      if (user) throw createHttpError.BadRequest("نام کاربری قبلا ثبت شده است");

      const newUser = await UserModel.create({
        username,
        password,
        first_name,
        last_name,
        password,
        // confirmPassword,
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
      await userRegister.validateAsync(req.body);
      const user = await this.checkExistUser(username);
      if (!user)
        throw createHttpError.BadRequest("نام کاربری یا رمز عبور اشتباه است");

      if (password !== user.password)
        throw createHttpError.BadRequest("نام کاربری یا رمز عبور اشتباه است");
      req.user = user;
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
          domain: ".pantomime.proroo.ir",
          signed: true,
          maxAge: tokenexpires,
          httpOnly: true,
          secure: true, 
          sameSite: "strict", 
        })
        .cookie("refreshtoken", refreshtoken, {
          domain: ".pantomime.proroo.ir",
          signed: true, 
          maxAge: refreshtokenexpires,
          httpOnly: true,
          secure: true, 
          sameSite: "strict",
        })
        .status(httpstatuscodes.OK)
        .json({
          statusCode: httpstatuscodes.OK,
          data: {
            statusCode: httpstatuscodes.OK,
            message: "با موفقیت وارد شدید",
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

  async userLogOut(req, res, next) {
    console.log(req);
    const cookieOptions = {
      maxAge: 1,
      expires: Date.now(),
      httpOnly: true,
      signed: true,
      sameSite: "strict",
      secure: true,
      path: "/",
      domain: ".pantomime.proroo.ir",
    };

    const cookieOptions3 = {
      maxAge: 1,
      expires: Date.now(),
      httpOnly: true,
      signed: true,
      sameSite: "strict",
      secure: true,
    };
    res
      .cookie("accesstoken", null, cookieOptions)
      .cookie("refreshtoken", null, cookieOptions)
      .cookie("accesstoken", null, cookieOptions3)
      .cookie("refreshtoken", null, cookieOptions3)
      .status(httpstatuscodes.OK)
      .json({
        statusCode: httpstatuscodes.OK,
        data: {
          message: "با موفقیت خارج شدید",
        },
      });
  }
}

module.exports = {
  userRegisterController: new UserController(),
};
