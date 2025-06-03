const mongoose = require("mongoose");
const { type } = require("os");

const Schema = mongoose.Schema;

const lable = new Schema({
  name: {
    type: String,
    require: true,
  },

  timestamps: true,
});

const model = mongoose.model("lable", lable);
module.exports = model;
