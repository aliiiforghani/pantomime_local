import createHttpError from "http-errors";
import { UserModel } from "../../models/user.js";
import {
  UserLoginValidator,
  UserRegisterValidator,
} from "../validator/user.schema.js";
import Controller from "./controller.js";
import httpstatuscodes from "http-status-codes";
import { SignAccessToken, SignRefreshToken } from "../../utils/functions.js";

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
      await UserLoginValidator.validateAsync(req.body);
      const { username, password } = req.body;
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
          domain: ".proroo.ir",
          // signed: true,
          maxAge: tokenexpires,
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
        })
        .cookie("refreshtoken", refreshtoken, {
          domain: ".proroo.ir",
          // signed: true,
          maxAge: refreshtokenexpires,
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
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
    if (req.user) req.user = null;

    res
      .cookie("refreshtoken", null, {
        domain: ".proroo.ir",
        maxAge: 1,
        expires: Date.now(),
        httpOnly: true,
        // signed: true,
        sameSite: "Lax",
        secure: true,
        path: "/",
      })
      .cookie("accesstoken", null, {
        domain: ".proroo.ir",
        maxAge: 1,
        expires: Date.now(),
        httpOnly: true,
        // signed: true,
        sameSite: "Lax",
        secure: true,
        path: "/",
      })
      .status(httpstatuscodes.OK)
      .json({
        statusCode: httpstatuscodes.OK,
        data: {
          message: "با موفقیت خارج شدید",
        },
      });
  }
}

export const userRegisterController = new UserController();
