const mongoose = require("mongoose");
const { type } = require("os");

const Schema = mongoose.Schema;

const note = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  date: {
    type: String,
  },
  photo: {
    type: String,
  },
  lable: {
    type: String,
    enum: [mongoose.Schema.Types.ObjectId, "ALL"],
    ref: "label",
    default: "ALL",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

  timestamps: true,
});

const model = mongoose.model("note", note);
module.exports = model;
