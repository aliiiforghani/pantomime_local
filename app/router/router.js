const { HomeRoutes } = require("./api")
const { CategoryRoutes } = require("./api/category")
const { HardshipRoutes } = require("./api/hardship")
const { SentenceRoutes } = require("./api/sentene")
const { UserRoutes } = require("./api/userRegister")
const router = require("express").Router()

router.use("/", HomeRoutes)
router.use("/user", UserRoutes)
router.use("/sentence", SentenceRoutes)
router.use("/category", CategoryRoutes)
router.use("/hardship", HardshipRoutes)


module.exports = {
    AllRoutes : router
}