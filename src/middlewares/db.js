const mongoose = required("mongoose");

const url = "mongodb://localhost:27017/NoteApp";

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected Success");
  })
  .catch((err) => {
    console.log("Error in the Connection");
  });
