const mongoose = require("mongoose");
const { type } = require("os");

const Schema = mongoose.Schema;

const admin = new Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    Role: {
      type: String,
      required: false,
      default: "ADMIN",
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("admin", admin);
module.exports = model;
