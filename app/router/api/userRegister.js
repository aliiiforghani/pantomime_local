const { userRegisterController } = require("../../http/controller/user.controller");

const router = require("express").Router();

/**
 * @swagger
 *  tags:
 *      name: user-register
 *      description: register
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Register:
 *              type: object
 *              required:
 *                  -   username
 *                  -   password
 *              properties:
 *                  username:
 *                      type: string
 *                      description: username for register
 *                  password:
 *                      type: string
 *                      description: password for register
 *                  first_name:
 *                      type: string
 *                  last_name:
 *                      type: string
 *                  mobile:
 *                      type: string
 *          Login:
 *              type: object
 *              required:
 *                  -   username
 *                  -   password
 *              properties:
 *                  username:
 *                      type: string
 *                      description: username for register
 *                  password:
 *                      type: string
 *                      description: password for register
 */


/**
 * @swagger
 *  /user/register:
 *      post:
 *          tags: [user-register]
 *          summary: user register
 *          description: user register with username and password
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref : '#/components/schemas/Register'
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Register'
 *          responses: 
 *              200:
 *                  description : success
 *              400:
 *                  description : error
 */


router.post("/register", userRegisterController.userRegister)


/**
 * @swagger
 *  /user/login:
 *      post:
 *          tags: [user-register]
 *          summary: user login
 *          description: user login with username and password
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref : '#/components/schemas/Login'
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Login'
 *          responses: 
 *              200:
 *                  description : success
 *              400:
 *                  description : error
 */


router.post("/login", userRegisterController.userLogin)


/**
 * @swagger
 *  /user/profile:
 *      get:
 *          tags: [user-register]
 *          summary: get user profile
 *          description: get user  
 *          responses: 
 *              200:
 *                  description : success
 *              400:
 *                  description : error
 */



router.get("/profile", userRegisterController.getUserProfile);
module.exports = {
    UserRoutes : router
}