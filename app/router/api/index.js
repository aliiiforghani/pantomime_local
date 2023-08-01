const { homeContoller } = require("../../http/controller/home.controller");
const { checkLogin } = require("../../http/middlewares/auth");
const router = require("express").Router();

router.post("/", checkLogin, homeContoller.indexPage);

module.exports = {
  HomeRoutes: router,
};
