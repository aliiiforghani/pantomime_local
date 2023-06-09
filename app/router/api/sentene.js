const { SentenceController } = require("../../http/controller/pantomime.controller");
const { checkLogin } = require("../../http/middlewares/auth");

const router = require("express").Router();

/**
 * @swagger
 *  tags:
 *      name: sentence
 *      description: register
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          AddSentence:
 *              type: object
 *              required:
 *                  -   title
 *                  -   text
 *                  -   category
 *                  -   hardship
 *              properties:
 *                  title:
 *                      type: string
 *                      description: title of sentence
 *                  text:
 *                      type: string
 *                      description: text of sentence
 *                  category:
 *                      type: string
 *                      description: id of category
 *                  hardship:
 *                      type: string
 *                      description: id of hardship
 *          AdminAddSentence:
 *              type: object
 *              required:
 *                  -   title
 *                  -   text
 *                  -   category
 *                  -   hardship
 *                  -   published
 *              properties:
 *                  title:
 *                      type: string
 *                      description: title of sentence
 *                  text:
 *                      type: string
 *                      description: text of sentence
 *                  category:
 *                      type: string
 *                      description: id of category
 *                  hardship:
 *                      type: string
 *                      description: id of hardship
 *                  published:
 *                      type: string
 *                      enum: [true, false]
 *                      description: true or false
 *          EditSentence:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: title of sentence
 *                  text:
 *                      type: string
 *                      description: text of sentence
 *                  category:
 *                      type: string
 *                      enum: [640efe6a0f0c59ba269ef36b,640efe700f0c59ba269ef36e,640efe720f0c59ba269ef371,640f02d12ae696ef7dc7e7c7,641092a8107dfbb178645604,641092ab107dfbb178645607,641092ae107dfbb17864560a]
 *                  hardship:
 *                      enum: [آسان, متوسط, سخت, خیلی سخت]
 *                      type: string
 *                  published:
 *                      enum: [true, false]
 *                      type: string
 *          random:
 *              type: object
 *              properties:
 *                  categoryId:
 *                      type: string
 *                  hardshipId:
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
 *  /sentence/add:
 *      post:
 *          tags: [sentence]
 *          summary: add sentence
 *          description: add sentence
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref : '#/components/schemas/AddSentence'
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/AddSentence'
 *          responses: 
 *              200:
 *                  description : success
 *              400:
 *                  description : error
 */


router.post("/add", checkLogin ,SentenceController.addSentence)
/**
 * @swagger
 *  /sentence/admin/add:
 *      post:
 *          tags: [sentence]
 *          summary: add sentence
 *          description: add sentence
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref : '#/components/schemas/AdminAddSentence'
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/AdminAddSentence'
 *          responses: 
 *              200:
 *                  description : success
 *              400:
 *                  description : error
 */


router.post("/admin/add", checkLogin ,SentenceController.adminAddSentence)


/**
 * @swagger
 *  /sentence/edit/{id}:
 *      patch:
 *          tags: [sentence]
 *          summary: edit sentence
 *          description: edit sentence
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *                  description: id of sentence for update sentence
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref : '#/components/schemas/EditSentence'
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/EditSentence'
 *          responses: 
 *              200:
 *                  description : success
 *              400:
 *                  description : error
 */


router.patch("/edit/:id", checkLogin ,SentenceController.editSentence)




/**
 * @swagger
 *  /sentence/all:
 *      get:
 *          tags: [sentence]
 *          summary: get all sentence
 *          description: get all sentences
 *          responses: 
 *              200:
 *                  description : success
 *              400:
 *                  description : error
 */


router.get("/all" ,SentenceController.getAllSentence)


/**
 * @swagger
 *  /sentence/random:
 *      post:
 *          tags: [sentence]
 *          summary: random hardship
 *          description: random hardship
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref : '#/components/schemas/random'
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/random'
 *          responses: 
 *              200:
 *                  description : success
 *              400:
 *                  description : error
 */

router.post("/random" ,SentenceController.getRandomSentence)





module.exports = {
    SentenceRoutes : router
}