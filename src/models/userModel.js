const mongoose = require("mongoose");
const { type } = require("os");
const noteSchema = require("./notesModel");

const Schema = mongoose.Schema;

const user = new mongoose.Schema(
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
        label: {
          type: String,
          enum: [mongoose.Schema.Types.String, "ALL"],
          ref: "label",
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
        content: {
          type: String,
          require: true,
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
