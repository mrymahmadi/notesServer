const mongoose = require("mongoose");
const { type } = require("os");

const Schema = mongoose.Schema;

const note = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    lables: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lable",
        default: "ALL",
      },
    ],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const model = mongoose.model("note", note);
module.exports = model;
