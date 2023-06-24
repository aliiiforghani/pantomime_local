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
      await userRegister.validateAsync(req.body);
      const user = await this.checkExistUser(username);
      if (!user) throw createHttpError.BadRequest("نام کاربری یا رمز عبور اشتباه است");

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
          domain: ".prorobo.ir",
          signed: true, // Indicates if the cookie should be signed
          maxAge: tokenexpires,
          httpOnly: true, // optional
          secure: true, // optional, set to true if using HTTPS
          sameSite: "strict", // optional, can be 'strict', 'lax', or 'none'
        })
        .cookie("accesstoken", accesstoken, {
          signed: true, // Indicates if the cookie should be signed
          maxAge: tokenexpires,
          httpOnly: true, // optional
          secure: true, // optional, set to true if using HTTPS
          sameSite: "strict", // optional, can be 'strict', 'lax', or 'none'
        })
        .cookie("accesstoken", accesstoken, {
          domain: ".api.prorobo.ir",
          signed: true, // Indicates if the cookie should be signed
          maxAge: tokenexpires,
          httpOnly: true, // optional
          secure: true, // optional, set to true if using HTTPS
          sameSite: "strict", // optional, can be 'strict', 'lax', or 'none'
        })
        .cookie("refreshtoken", refreshtoken, {
          domain: ".prorobo.ir",
          signed: true, // Indicates if the cookie should be signed
          maxAge: refreshtokenexpires,
          httpOnly: true, // optional
          secure: true, // optional, set to true if using HTTPS
          sameSite: "strict", // optional, can be 'strict', 'lax', or 'none'
        })
        .cookie("refreshtoken", refreshtoken, {
          signed: true, // Indicates if the cookie should be signed
          maxAge: refreshtokenexpires,
          httpOnly: true, // optional
          secure: true, // optional, set to true if using HTTPS
          sameSite: "strict", // optional, can be 'strict', 'lax', or 'none'
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
      sameSite: "Lax",
      secure: true,
      path: "/",
      domain: ".prorobo.ir",
    };
    const cookieOptions2 = {
      maxAge: 1,
      expires: Date.now(),
      httpOnly: true,
      signed: true,
      sameSite: "Lax",
      secure: true,
      path: "/",
      domain: ".api.prorobo.ir",
    };
    const cookieOptions3 = {
      maxAge: 1,
      expires: Date.now(),
      httpOnly: true,
      signed: true,
      sameSite: "Lax",
      secure: true,
    };
    res
      .cookie("accesstoken", null, cookieOptions)
      .cookie("refreshtoken", null, cookieOptions)
      .cookie("accesstoken", null, cookieOptions2)
      .cookie("refreshtoken", null, cookieOptions2)
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

  // async getUserProfile(req, res) {
  //   console.log(req.user);
  // const { _id: userId } = req.user;
  // const user = await UserModel.findById(userId, { otp: 0 });
  // const cart = (await getUserCartDetail(userId))?.[0];
  // const payments = await PaymentModel.find({ user: userId });

  // return res.status(httpstatuscodes.OK).json({
  //   statusCode: httpstatuscodes.OK,
  //   data: {
  //     user,
  //     payments,
  //     cart,
  //   },
  // });
  // }
}

module.exports = {
  userRegisterController: new UserController(),
};
