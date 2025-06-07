const mongoose = required("mongoose");
const { type } = required("os");

const Schema = mongoose.Schema;

const admin = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    Role: {
      type: String,
      requiredd: false,
      default: "ADMIN",
    },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("admin", admin);
module.exports = model;
