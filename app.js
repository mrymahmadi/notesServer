const routes = require("./routes/index");
const express = require("express");
require("dotenv").config();
const colors = require("colors");
const path = require("path");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const winston = require("winston");
const schedule = require("node-schedule");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();
const server = new http.Server(app);
const log = console.log;
const os = require("os");

const totalMemory = os.totalmem();
const freeMemory = os.freemem();
log("totalMemory : ".red + totalMemory);
log("freeMemory : ".magenta + freeMemory);
require("express-async-errors");
require("winston-mongodb");

const url = "mongodb://localhost:27017/NoteApp";

class Application {
  constructor() {
    this.startServer();
    this.setupMongoose();
    this.setupRoutes();
  }

  setupMongoose() {
    mongoose
      .connect(url)
      .then(() => {
        console.log("Connected Success");
      })
      .catch((err) => {
        console.log("Error in the Connection");
      });
  }

  setupRoutes() {
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true }));

    //app.use(morgan("combined"));
    app.use(bodyParser.json());
    //app.use(Error);

    //secret req port

    require("./swagger-setup")(app);
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    app.use("/", routes);
  }

  startServer() {
    const port = 2070;

    server.listen(port, (err) => {
      if (err) console.log(err);
      else console.log("app listen to port : ".blue + port);
      log("condition: ".gray);
    });
  }
}
module.exports = Application;
