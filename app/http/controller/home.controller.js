const httpStatusCodes = require("http-status-codes");
const Controller = require("./controller");
class HomeController extends Controller {
    async indexPage(req, res, next) {
const user = req.user
        try {
            return res.status(httpStatusCodes.OK).json({
                statusCode: httpStatusCodes.OK,
                data: {
                    user,
                    message: " Index Page "
                }
            })
        } catch (error) {
            next(error)
        }
    }
}
module.exports = {
   homeContoller : new HomeController()
}

