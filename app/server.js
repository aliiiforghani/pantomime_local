const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const express = require("express");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { COOKIE_PARSER_SECRET_KET } = require("./utils/constans");
const { AllRoutes } = require("./router/router");
const morgan = require("morgan");
const createHttpError = require("http-errors");
const serveFavicon = require("serve-favicon");
const cors = require("cors");
require("dotenv").config();
module.exports = class Application {
  #app = express();
  #DB_URI;
  #PORT;
  constructor(PORT, DB_URI) {
    this.#PORT = PORT;
    this.#DB_URI = DB_URI;
    this.configApplication();
    this.initClientSession();
    this.connectToMongoDB();
    this.createServer();
    // this.initRedis()
    this.createRoutes();
    this.errorHandling();
  }
  configApplication() {
    //     const whitelist = ['http://prorobo.ir']
    //     const corsOptions = {
    //         origin: function(origin, callback) {
    //             console.log('Received origin:', origin, 'callback:', callback);
    //         if (whitelist.indexOf(origin) !== -1) {
    //         callback(null, true)
    //     } else {
    //         callback(new Error('دسترسی شما به دلیل امنیت سرور امکان پذیر نیست'))
    //     }}
    // }
    // this.#app.use(cors(corsOptions))
    this.#app.use(
      cors({ credentials: true, origin: ["https://prorobo.ir", "https://api.prorobo.ir"] })
    );
    this.#app.use(morgan("dev"));
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
    this.#app.use(express.static(path.join(__dirname, "..", "public")));
    this.#app.use(
      serveFavicon(path.join(__dirname, "..", "public", "favicon.png"))
    );
    this.#app.use(
      "/api-doc",
      swaggerUI.serve,
      swaggerUI.setup(
        swaggerJSDoc({
          swaggerDefinition: {
            openapi: "3.0.0",
            info: {
              title: "pantomime project",
              version: "1.0.0",
              description:
                "پیشتهاد کلمه . جمله . ضرب المثل و ... برای بازی پانتومیم",
              contract: {
                name: "Ali Forghani",
                email: "forgani.ali@gmail.com",
              },
            },
            server: {
              url: "http://127.0.0.1:1000",
            },
          },
          apis: ["./app/router/**/*.js"],
        }),
        {
          security: [],
        },
        { explorer: true }
      )
    );
  }

  createServer() {
    const http = require("http");
    const server = http.createServer(this.#app);
    server.listen(this.#PORT, () => {
      console.log(" run > http://localhost:" + this.#PORT);
    });
  }
  connectToMongoDB() {
    mongoose.connect(this.#DB_URI),
      (error) => {
        if (!error) return console.log("connected to mongodb");
        return console.log(error.message);
      };
    mongoose.connection.on("connected", () => {
      console.log("mongoose connected to DB");
    });
    mongoose.connection.on("disconnected", () => {
      console.log("mongoose disconnected");
    });
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("disconnected");
      process.exit(0);
    });
  }
  // initRedis(){
  //     require("./utils/initRedis")
  // }
  initClientSession() {
    this.#app.use(cookieParser(COOKIE_PARSER_SECRET_KET));
    this.#app.use(
      session({
        secret: COOKIE_PARSER_SECRET_KET,
        // cookie: { domain:'.prorobo.ir'},
        resave: true,
        saveUninitialized: true,
      })
    );
  }
  createRoutes() {
    this.#app.use(AllRoutes);
  }

  errorHandling() {
    this.#app.use((req, res, next) => {
      next(createHttpError.NotFound("صفحه مورد نظر یافت نشد"));
    });
    this.#app.use((error, req, res, next) => {
      const serverError = createHttpError.InternalServerError();
      const statusCode = error.status || serverError.status;
      const message = error.message || serverError.message;
      return res.status(statusCode).json({
        statusCode,
        errors: {
          message,
        },
      });
    });
  }
};
