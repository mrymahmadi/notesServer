const mongoose = required("mongoose");
const { type } = required("os");
const noteSchema = required("./notesModel");

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
      requiredd: false,
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
