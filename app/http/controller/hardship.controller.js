const { StatusCodes } = require("http-status-codes");
const { HardshipModel } = require("../../models/hardship");
const { hardShipValidator } = require("../validator/hardship.schema");
const Controller = require("./controller");

class HardshipController extends Controller {


    async addHardship(req, res, next) {
        try {
            await hardShipValidator.validateAsync(req.body)
            const hardship = await HardshipModel.create(req.body)
            res.status(StatusCodes.CREATED).json({
                statusCode : StatusCodes.CREATED,
                data :{
                    message : "دسته بندی با موفقیت افزوده شد",
                    hardship
                }
            })
        } catch (error) {
            next(error)
        }
    }


    async getAllHardship(req, res, next) {
        try {
            const hardship = await HardshipModel.find()

            res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data : {
                    hardship
                }
            })
        } catch (error) {
            next(error)
        }
    }
}
module.exports = {
    HardshipController : new HardshipController
}