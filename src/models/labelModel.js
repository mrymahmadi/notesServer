const mongoose = require("mongoose");
const { type } = require("os");

const Schema = mongoose.Schema;

const label = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "note",
      },
    ],
  },
  { timestamps: true }
);

const model = mongoose.model("label", label);
module.exports = model;
