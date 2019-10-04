const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const multer = require("multer");
const Photo = require("../models/phohSchema");
const addMiddlewares = require("../middleware/passport-config");
const homePageWithNotification = require("../helpers/homePageWithNotification");
const { getUserNickname } = require("../helpers/reqHelpers");
const User = require("../models/userSchema");
const notifications = require("../constants/notification-types");

// Настройки Multer

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

// Настройки Routs
addMiddlewares(router);

router.get("/", async function(req, res, next) {
  console.log("-----------------------------------");
  const img = await Photo.find();
  console.log(img);

  res.render("index", {
    images: img,
    currentUser: getUserNickname(req)
  });
});

router
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res, next) => {
    passport.authenticate("local", (err, user, next) => {
      if (err) {
        return res.json({ err: "ошибка" });
      }
      req.logIn(user, err => {
        if (err) {
          return res.json({ err: "ошибка" });
        }
        return res.redirect(
          homePageWithNotification(notifications.message, "You Logged In!")
        );
      });
    })(req, res, next);
  });

router
  .route("/reg")
  .get((req, res) => {
    res.render("reg");
  })
  .post(async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    const curUser = await User.getByUsername(username);
    if (curUser.length === 0) {
      const hash = await bcrypt.hash(password, 10);
      await User.create({
        username: username,
        password: hash
      });
      return res.redirect(homePageWithNotification());
    }
    return res.render("reg", {
      [notifications.error]: "This username is already used"
    });
  });

router
  .route("/profile")
  .get(async (req, res, next) => {
    const user = await User.findOne({ username: req.user.username });
    const img = await Photo.find({ author: req.user.username });

    res.render("profile", { currentUser: user, images: img });
  })
  .post(upload.single("avatar"), async (req, res) => {
    const user = await User.findOne({ username: req.user.username });
    const photo = new Photo({
      name: req.body.photoName,
      description: req.body.description,
      _id: new mongoose.Types.ObjectId(),
      photoImage: req.file.path,
      author: user.username
    });
    user.images.push(photo._id);
    await user.save();
    await photo.save();
    res.redirect("./profile");
  });

router.route("/photo/:id").get(async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  console.log("-----", photo);

  res.render("photo", { img: photo });
});
module.exports = router;
