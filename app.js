const express = require("express");
const path = require('path');

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const fs = require('fs');

const placesRouter = require("./routes/places-routes");
const userRouter = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use(cors());

app.use("/api/places", placesRouter);

app.use("/api/users", userRouter);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if(req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    })
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknouwn error occured!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qnhlng8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("sucess");
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
