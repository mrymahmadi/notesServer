const mongoose = require("mongoose");
const { type } = require("os");

const Schema = mongoose.Schema;

const task = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("task", task);
module.exports = model;
