const createHttpError = require("http-errors");
const { UserModel } = require("../../models/user")
const { verifyAccessToken, verifyRefreshToken, verifyAccessTokenWithoutError } = require("./verifytoken");
const httpstatuscodes = require("http-status-codes");
async function checkLogin(req, res, next) {
    try {
        let {accesstoken, refreshtoken} = req.cookies
        if(!accesstoken) accesstoken = null

        if(!refreshtoken) refreshtoken = null
    
const tokenexpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
const refreshtokenexpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        if(!accesstoken) {
            if(!refreshtoken) {
                throw createHttpError.Unauthorized("وارد حساب کاربری خود شوید")
            }else {
            const {accesstoken, newrefreshtoken} = await verifyRefreshToken(refreshtoken)
            res.cookie("accesstoken", accesstoken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                expires: tokenexpires
              })
              .cookie("refreshtoken", newrefreshtoken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                expires: refreshtokenexpires
              })
              return next()
        }}else{
            user = await verifyAccessTokenWithoutError(accesstoken)
            if(!user) {
                const {accesstoken, newrefreshtoken} = await verifyRefreshToken(refreshtoken)
                if(!accesstoken || !refreshtoken) {throw createHttpError.Unauthorized("وارد حساب کاربری خود شوید")
            }else {

                res.cookie("accesstoken", accesstoken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    expires: tokenexpires
                  })
                  .cookie("refreshtoken", newrefreshtoken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    expires: refreshtokenexpires
                  })}
                  return next()
            }
        return next()
        }
        
    } catch (error) {
        next(error)
    }
}


module.exports = {
    checkLogin
}