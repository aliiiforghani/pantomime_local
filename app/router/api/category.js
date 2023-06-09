const { CategoryController} = require("../../http/controller/category.controller");
const { checkLogin } = require("../../http/middlewares/auth");

const router = require("express").Router();

/**
 * @swagger
 *  tags:
 *      name: category
 *      description: register
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          AddCategory:
 *              type: object
 *              required:
 *                  -   title
 *              properties:
 *                  title:
 *                      type: string
 *                      description: title of category
 *                      enum: [همه, جمله, ضرب المثل, شعر,تک کلمه ای,دو کلمه ای,سه کلمه ای]
 */


/**
 * @swagger
 *  /category/add:
 *      post:
 *          tags: [category]
 *          summary: add sentence
 *          description: add sentence
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref : '#/components/schemas/AddCategory'
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/AddCategory'
 *          responses: 
 *              200:
 *                  description : success
 *              400:
 *                  description : error
 */


router.post("/add", checkLogin ,CategoryController.addCategory)

/**
 * @swagger
 *  /category/all:
 *      get:
 *          tags: [category]
 *          summary: get all sentence
 *          description: get all sentences
 *          responses: 
 *              200:
 *                  description : success
 *              400:
 *                  description : error
 */


router.get("/all" ,CategoryController.getAllCategory)



/**
 * @swagger
 *  /category/remove/{id}:
 *      delete:
 *          tags: [category]
 *          summary: remove category
 *          description: remove category
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  required: true
 *          responses: 
 *              200:
 *                  description : success
 *              400:
 *                  description : error
 */


router.delete("/remove/:id", checkLogin , CategoryController.removeCategory)

module.exports = {
    CategoryRoutes : router
}