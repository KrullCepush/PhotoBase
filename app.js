const createError = require("http-errors");
const express = require("express");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bcrypt = require("bcrypt");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const upload = multer({ dest: "uploads/" });

const app = express();

mongoose.connect("mongodb://localhost:27017/photoBase", {
  useNewUrlParser: true
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// app.use(logger("dev"));
app.use(
  morgan("dev", {
    skip: function(req, res) {
      return (
        req.url.indexOf(".jpg") != -1 ||
        req.url.indexOf(".png") != -1 ||
        req.url.indexOf(".jpeg") != -1
      );
    }
  })
);
app.use(express.json());
app.use("/uploads/", express.static("uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    store: new MongoStore({
      url: "mongodb://localhost:27017/photoBase",
      stringify: false
    }),
    cookie: {
      maxAge: 24 * 360000
    },
    secret: "photo-01-log-collection",
    resave: true,
    saveUninitialized: false
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
