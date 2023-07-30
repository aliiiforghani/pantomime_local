const createHttpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { default: mongoose } = require("mongoose");
const { CategoryModel } = require("../../models/category");
const { PantomimeModel } = require("../../models/pantomime");
const {
  copyObject,
  deleteInvalidPropertyInObject,
} = require("../../utils/functions");
const { idValidator } = require("../validator/id.schema");
const {
  randomSentenceValidator,
  addSentenceValidator,
  adminAddSentenceValidator,
} = require("../validator/sentence.schema");
const Controller = require("./controller");
const { HardshipModel } = require("../../models/hardship");

const SenteceBlackList = {};
Object.freeze(SenteceBlackList);
class PantomimeController extends Controller {
  async addSentence(req, res, next) {
    try {
      await addSentenceValidator.validateAsync(req.body);
      const { hardship, title, text, category } = req.body;
      const sentence = await PantomimeModel.create({
        hardship,
        title,
        text,
        category: [category, "64c699c3188ea1c9d208c75f"], //host
      });
      if (sentence.modifiedCount == 0)
        throw createHttpError("پیشنهاد شما ثبت نشد");
      return res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        data: {
          message: "پیشنهاد شما با موفقیت ثبت شد",
          sentence,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  async adminAddSentence(req, res, next) {
    try {
      await adminAddSentenceValidator.validateAsync(req.body);
      const { hardship, title, text, category } = req.body;
      const sentence = await PantomimeModel.create({
        hardship,
        title,
        text,
        category: [category, "64c699c3188ea1c9d208c75f"], //host
        published: true,
      });
      if (sentence.modifiedCount == 0)
        throw createHttpError("پیشنهاد شما ثبت نشد");
      return res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        data: {
          message: "پیشنهاد شما با موفقیت ثبت شد",
          sentence,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async editSentence(req, res, next) {
    try {
      await idValidator.validateAsync(req.params);
      const { id } = req.params;
      const sentence = await PantomimeModel.findById({
        _id: new mongoose.Types.ObjectId(id),
      });
      if (!sentence) throw createHttpError("موردی یافت نشد");
      const data = copyObject(req.body);
      let blackListField = Object.values(SenteceBlackList);
      const updatedData = deleteInvalidPropertyInObject(data, blackListField);
      const categoryAll = "640f02d12ae696ef7dc7e7c7";
      if (updatedData.category)
        updatedData.category = [updatedData.category, categoryAll];
      if (updatedData.hardship)
        updatedData.hardship = [updatedData.hardship, "all"];
      const update = await PantomimeModel.updateOne(
        { _id: sentence._id },
        { $set: updatedData }
      );
      if (update.modifiedCount == 0)
        throw createHttpError("درخواست شما انجام نشد");

      const updatedSentence = await PantomimeModel.findById({
        _id: new mongoose.Types.ObjectId(id),
      });
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        data: {
          message: "پیشنهاد شما با موفقیت تغییر شد",
          updatedSentence,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllSentence(req, res, next) {
    try {
      const sentences = await PantomimeModel.find();
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        data: {
          sentences,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Import your CategoryModel and HardshipModel

  async getRandomSentence(req, res, next) {
    try {
      await randomSentenceValidator.validateAsync(req.body);
      const { categoryId, hardshipId } = req.body;
      let category, hardship;

      if (categoryId) {
        // Retrieve the actual category value based on the categoryId
        category = await CategoryModel.findById(categoryId);
      }
      if (hardshipId) {
        // Retrieve the actual hardship value based on the hardshipId
        hardship = await HardshipModel.findById(hardshipId);
      }

      const match = {
        published: true,
      };

      if (category) {
        match.category = new mongoose.Types.ObjectId(categoryId);
      }

      if (hardship) {
        match.hardship = new mongoose.Types.ObjectId(hardshipId);
      }

      const randomPantomime = await PantomimeModel.aggregate([
        { $match: match },
        { $sample: { size: 1 } },
      ]).exec();

      if (randomPantomime.length > 0) {
        const result = randomPantomime[0];
        return res.status(StatusCodes.OK).json({
          statusCode: StatusCodes.OK,
          data: {
            result,
          },
        });
      } else {
        throw createHttpError.BadRequest("موردی یافت نشد");
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  SentenceController: new PantomimeController(),
};
