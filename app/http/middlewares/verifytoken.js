const createHttpError = require("http-errors");
const JWT = require("jsonwebtoken");
const { UserModel } = require("../../models/user");
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require("../../utils/constans");
const { SignAccessToken, SignRefreshToken } = require("../../utils/functions");

async function verifyAccessToken(accesstoken) {
    const payload =  await (JWT.verify(accesstoken, ACCESS_TOKEN_SECRET_KEY, async (err, payload) => {
        if(err) throw createHttpError.Unauthorized("وارد حساب کاربری خود شوید");
        return payload }))
        const {username} = payload
            const user = await UserModel.findOne({username}, {password: 0})
            if(!user) throw createHttpError("حساب کاربری یافت نشد")
            return user
    }
async function verifyAccessTokenWithoutError(accesstoken) {
    const payload =  await (JWT.verify(accesstoken, ACCESS_TOKEN_SECRET_KEY, async (err, payload) => {
        if(err) return payload = [];
        return payload }))
        const {username} = payload
            const user = await UserModel.findOne({username}, {password: 0})
            return user
    }

async function verifyRefreshToken(refreshtoken) {
    const payload =  await (JWT.verify(refreshtoken, REFRESH_TOKEN_SECRET_KEY, async (err, payload) => {
            if(err) throw createHttpError.Unauthorized("وارد حساب کاربری خود شوید");
            return payload }))
            const {username} = payload
            const user = await UserModel.findOne({username}, {password: 0})
            if(!user) throw createHttpError("حساب کاربری یافت نشد");

            const accesstoken = await SignAccessToken(user._id)
            const newrefreshtoken = await SignRefreshToken(user._id)
            return {accesstoken, newrefreshtoken}
        
    }

module.exports = {
    verifyAccessToken,
    verifyRefreshToken,
    verifyAccessTokenWithoutError
}

