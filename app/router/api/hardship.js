const hardshipController = require("../../http/controller/hardship.controller");
const { HardshipController } = require("../../http/controller/hardship.controller");
const { checkLogin } = require("../../http/middlewares/auth");

const router = require("express").Router();

/**
 * @swagger
 *  tags:
 *      name: hardship
 *      description: hardship
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          AddHardship:
 *              type: object
 *              required:
 *                  -   title
 *              properties:
 *                  title:
 *                      type: string
 *                      description: title of hardship
 *                      enum: [آسان, متوسط, سخت, خیلی سخت]
 */


/**
 * @swagger
 *  /hardship/add:
 *      post:
 *          tags: [hardship]
 *          summary: add hardship
 *          description: add hardship
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref : '#/components/schemas/AddHardship'
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/AddHardship'
 *          responses: 
 *              200:
 *                  description : success
 *              400:
 *                  description : error
 */


router.post("/add", checkLogin ,HardshipController.addHardship)

/**
 * @swagger
 *  /hardship/all:
 *      get:
 *          tags: [hardship]
 *          summary: get all hardship
 *          description: get all hardship
 *          responses: 
 *              200:
 *                  description : success
 *              400:
 *                  description : error
 */


router.get("/all" , HardshipController.getAllHardship)





module.exports = {
    HardshipRoutes : router
}