const createHttpError = require("http-errors");
const {
  verifyAccessToken,
  verifyRefreshToken,
  verifyAccessTokenWithoutError,
} = require("./verifytoken.js");

async function checkLogin(req, res, next) {
  try {
    let accesstoken =
      req.cookies.accesstoken || req.signedCookies["accesstoken"];
    let refreshtoken =
      req.cookies.refreshtoken || req.signedCookies["refreshtoken"];

    const tokenexpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const refreshtokenexpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    if (!accesstoken) {
      if (!refreshtoken) {
        throw createHttpError.Unauthorized("وارد حساب کاربری خود شوید");
      } else {
        const { accesstoken, newrefreshtoken } = await verifyRefreshToken(
          refreshtoken
        );
        user = await verifyAccessTokenWithoutError(accesstoken);
        req.user = user;
        res
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
          });

        return next();
      }
    } else {
      user = await verifyAccessTokenWithoutError(accesstoken);
      if (!user) {
        const { accesstoken, newrefreshtoken } = await verifyRefreshToken(
          refreshtoken
        );
        if (!accesstoken || !refreshtoken) {
          throw createHttpError.Unauthorized("وارد حساب کاربری خود شوید");
        } else {
          res
            .cookie("accesstoken", accesstoken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              expires: tokenexpires,
            })
            .cookie("refreshtoken", newrefreshtoken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              expires: refreshtokenexpires,
            });
        }
        return next();
      }
      req.user = user;
      return next();
    }
  } catch (error) {
    next(error);
  }
}
module.exports = {
  checkLogin,
};
