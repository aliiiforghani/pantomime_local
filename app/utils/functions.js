const JWT = require("jsonwebtoken")
const createHttpError = require("http-errors");
const { UserModel } = require("../models/user");
const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = require("./constans");
const redisClient = require("./initredis");

function SignAccessToken(userId) {
    return new Promise(async (resolve, reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            username: user.username
        };
        const options = {
            expiresIn: "1d"
        };
        JWT.sign(payload, ACCESS_TOKEN_SECRET_KEY, options, (err, token) => {
            if (err) reject(createHttpError.InternalServerError("خطای سروری"));
            resolve(token)
        })
    })
}
function SignRefreshToken(userId) {
    return new Promise(async (resolve, reject) => {
        const user = await UserModel.findById(userId)
        const payload = {
            username: user.username
        };
        const options = {
            expiresIn: "7d"
        };
        JWT.sign(payload, REFRESH_TOKEN_SECRET_KEY, options, async (err, token) => {
            if (err) reject(createHttpError.InternalServerError("خطای سروری"));
            const expiresIn = 365 * 24 * 60 * 60
            // await redisClient.SETEX(String(userId), expiresIn, token);
            resolve(token, expiresIn)
        })
    })
}
function VerifyRefreshToken(token) {
    return new Promise((resolve, reject) => {
        JWT.verify(token, REFRESH_TOKEN_SECRET_KEY, async (err, payload) => {
            if (err) reject(createHttpError.Unauthorized("وارد حساب کاربری خود شوید"))
            const { mobile } = payload || {};
            const user = await UserModel.findOne({ mobile }, { password: 0, otp: 0 })
            if (!user) reject(createHttpError.Unauthorized("حساب کاربری یافت نشد"))
            // const refreshToken = await redisClient.get(String(user?._id));
            // if (!refreshToken) reject(createHttpError.Unauthorized("ورود مجدد به حسابی کاربری انجام نشد"))
            // if (token === refreshToken) return resolve(mobile);
            reject(createError.Unauthorized("ورود مجدد به حسابی کاربری انجام نشد"))
        })
    })
}


function deleteInvalidPropertyInObject(data = {}, blackListFields = []) {
    let nullishData = ["", " ", "0", 0, null, undefined]
    Object.keys(data).forEach(key => {
        if (blackListFields.includes(key)) delete data[key]
        if (typeof data[key] == "string") data[key] = data[key].trim();
        if (Array.isArray(data[key]) && data[key].length > 0) data[key] = data[key].map(item => item.trim())
        if (Array.isArray(data[key]) && data[key].length == 0) delete data[key]
        if (nullishData.includes(data[key])) delete data[key];
    })
    return data
}

function copyObject(object) {
    return JSON.parse(JSON.stringify(object))
}
module.exports = {
    SignAccessToken,
    SignRefreshToken,
    VerifyRefreshToken,
    copyObject,
    deleteInvalidPropertyInObject
}