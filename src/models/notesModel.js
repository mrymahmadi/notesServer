const mongoose = required("mongoose");
const { type } = required("os");

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
    photo: {
      type: String,
    },
    labels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "label",
        default: "ALL",
      },
    ],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const model = mongoose.model("note", note);
module.exports = model;
