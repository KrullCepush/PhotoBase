const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const Photo = require("../models/phohSchema");

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

router
  .route("/login")
  .get((req, res) => {
    res.send("respond with a login");
  })
  .post((req, res) => {
    res.send("respond with a resource");
  });

router
  .route("/reg")
  .get((req, res) => {
    res.send("respond with a reg");
  })
  .post((req, res) => {
    res.send("respond with a resource");
  });

router
  .route("/profile")
  .get(async (req, res) => {
    const user = await Photo.find(
      {},
      { description: 1, photoImage: 1, _id: 1 }
    );
    console.log(user);

    res.render("profile", { user: user });
  })
  .post(upload.single("avatar"), async (req, res) => {
    const photo = new Photo({
      name: req.body.photoName,
      description: req.body.description,
      _id: new mongoose.Types.ObjectId(),
      photoImage: req.file.path
    });
    console.log(photo);
    await photo.save();
    res.redirect("./profile");
  });

router.route("/profile/:id").get(async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render("photo", { user: photo });
  console.log("sasasa", photo);
});
module.exports = router;
