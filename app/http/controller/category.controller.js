const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { default: mongoose } = require("mongoose");
const { CategoryModel } = require("../../models/category");
const { categoryValidator } = require("../validator/category.schema");
const { idValidator } = require("../validator/id.schema");
const Controller = require("./controller");

class CatagoryController extends Controller {
  async addCategory(req, res, next) {
    try {
      await categoryValidator.validateAsync(req.body);
      const category = await CategoryModel.create(req.body);
      res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        data: {
          message: "دسته بندی با موفقیت افزوده شد",
          category,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllCategory(req, res, next) {
    try {
      const category = await CategoryModel.find();
      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        data: {
          category,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async removeCategory(req, res, next) {
    try {
      await idValidator.validateAsync(req.params);
      const { id } = req.params;
      const category = await CategoryModel.find({
        _id: new mongoose.Types.ObjectId(id),
      });
      if (category.length == 0)
        throw createHttpError.BadRequest("دسته بندی ای با این شناسه یافت نشد");

      const result = await CategoryModel.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      if (result.deletedCount == 0)
        throw createHttpError.InternalServerError("حذف دسته بندی انجام نشد");

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        data: {
          message: "خذف دسته بندی با موفقیت انجام شد",
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = {
  CategoryController: new CatagoryController(),
};
