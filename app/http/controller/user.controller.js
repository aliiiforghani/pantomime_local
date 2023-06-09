const createHttpError = require("http-errors");
const { UserModel } = require("../../models/user");
const { userRegister } = require("../validator/user.schema");
const Controller = require("./controller")
const httpstatuscodes = require("http-status-codes");
const { SignAccessToken, SignRefreshToken } = require("../../utils/functions");
const { ONE_DAY, ONE_MOUNTH } = require("../../utils/constans");
const cookie =require("cookie")

class UserController extends Controller {



    async userRegister (req, res, next) {
        try {
            const {first_name, last_name, mobile, username, password} = req.body;
            await userRegister.validateAsync({username, password})
            const user = await this.checkExistUser(username)
            if(user) throw (createHttpError.BadRequest("نام کاربری قبلا ثبت شده است"))
            const newUser = await UserModel.create({username, password, first_name, last_name, mobile})
            if(newUser.modifiedCount == 0) throw createHttpError.InternalServerError("ثبت نام انجام نشد")
            return res.status(httpstatuscodes.CREATED).json({
                statusCode: httpstatuscodes.CREATED,
                data : {
                    massage : "ثبت نام شما با موفقیت انجام شد"
                }
            })
            
            
        } catch (error) {
            next(error)
        }
    }

    async userLogin(req, res, next) {
        try {
            const {username, password} = req.body;
            await userRegister.validateAsync(req.body)
            const user = await this.checkExistUser(username)
            if(!user) throw createHttpError.BadRequest("کاربری یافت نشد")
            if(password !== user.password) throw createHttpError.Unauthorized("نام کاربری یا رمز عبور اشتباه است")
            const accesstoken = await SignAccessToken(user._id)
            const refreshtoken = await SignRefreshToken(user._id)
            const userInformation = {
                firstname : user.first_name,
                lastname : user.last_name
            } 
            const tokenexpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
            const refreshtokenexpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            res
            return res.setHeader('Set-Cookie', [cookie.serialize('accesstoken', accesstoken, {
                // domain: 'prorobo.ir',
                path: '/',
                expires: tokenexpires,
                httpOnly: true, // optional
                secure: true, // optional, set to true if using HTTPS
                sameSite: 'strict', // optional, can be 'strict', 'lax', or 'none'
              }),cookie.serialize('refreshtoken', refreshtoken, {
                // domain: 'prorobo.ir',
                path: '/',
                expires: refreshtokenexpires,
                httpOnly: true, // optional
                secure: true, // optional, set to true if using HTTPS
                sameSite: 'strict', // optional, can be 'strict', 'lax', or 'none'
              })]).status(httpstatuscodes.OK).json({
                statusCode : httpstatuscodes.OK,
                data : {
                    accesstoken,
                    refreshtoken,
                    userInformation
                }
            })
        } catch (error) {
            next(error)
        }
    }





    async checkExistUser(username) { 
        const user = await UserModel.findOne({ username })
        return user
    }
}

module.exports = {
    userRegisterController : new UserController
}