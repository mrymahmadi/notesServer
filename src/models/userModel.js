const mongoose = require("mongoose");
const { type } = require("os");
const noteSchema = require("./notesModel");

const Schema = mongoose.Schema;

const user = new mongoose.Schema(
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
      unique: true,
    },
    Role: {
      type: String,
      required: false,
      default: "USER",
    },
    notes: [
      {
        title: { type: String },
        description: { type: String },
        lable: {
          type: String,
          enum: [mongoose.Schema.Types.String, "ALL"],
          ref: "lable",
          default: "ALL",
        },
        createdAt: { type: Date, default: Date.now },
      },
      /*  {
        note: { type: Schema.Types.ObjectId, ref: "note" },
        createdAt: { type: Date, default: Date.now },
      },*/
    ],

    tasks: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        content: {
          type: String,
          required: true,
        },
        done: {
          type: Boolean,
          default: false,
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const model = mongoose.model("user", user);
module.exports = model;

/*
collection
  .create({
    name: "maryam",
  })
  .then(() => {
    console.log("Document inserted");
  })
  .catch((err) => {
    console.log(err.Message);
  });
*/
