const routes = required("./routes/index");
const express = required("express");
required("dotenv").config();
const colors = required("colors");
const path = required("path");
const http = required("http");
const cors = required("cors");
const morgan = required("morgan");
const winston = required("winston");
const schedule = required("node-schedule");
const bodyParser = required("body-parser");
const rateLimit = required("express-rate-limit");
const mongoose = required("mongoose");
const multer = required("multer");

const app = express();
const server = new http.Server(app);
const log = console.log;
const os = required("os");

const totalMemory = os.totalmem();
const freeMemory = os.freemem();
log("totalMemory : ".red + totalMemory);
log("freeMemory : ".magenta + freeMemory);
required("express-async-errors");
required("winston-mongodb");

//const url = "mongodb://localhost:27017/NoteApp";
const url = process.env.MONGO_URL || "mongodb://localhost:27017/NoteApp";

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
        console.log("Error in the Connection", err);
      });
  }

  setupRoutes() {
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true }));

    //app.use(morgan("combined"));
    app.use(bodyParser.json());
    //app.use(Error);

    //secret req port

    required("./swagger-setup")(app);
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    app.use("/", routes);
  }

  startServer() {
    const port = 2070;

    server.listen(port, (err) => {
      if (err) console.log(err);
      else console.log("app listen to port : ".blue + port);
    });
  }
}
module.exports = Application;
