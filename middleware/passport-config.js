const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
// Usage of FileStore leads to problem of not login in from the first time?
// const FileStore = require('session-file-store')(session);
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");

function addMiddlewares(router) {
  // configure passport.js to use the local strategy
  passport.use(
    new LocalStrategy(
      { usernameField: "username" },
      async (username, password, done) => {
        const foundUsers = await User.getByUsername(username);
        if (foundUsers.length === 0) {
          return res.json({ err: "ошибка" });
        }
        const isPasswordCorrect = await bcrypt.compare(
          password,
          foundUsers[0].password
        );
        if (isPasswordCorrect) {
          const user = {
            id: foundUsers[0].id,
            username: foundUsers[0].username
          };
          return done(null, user);
        }
        return res.json({ err: "ошибка" });
      }
    )
  );

  router.use(express.urlencoded({ extended: false })); // Form data

  router.use(express.json()); // JSON

  router.use(
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

  router.use(passport.initialize());

  router.use(passport.session());

  // tell passport how to serialize the user
  passport.serializeUser((user, done) => {
    console.log("serializeUser: user:", user);
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("deserializeUser: id:", id);
    const user = await User.findById(id);
    done(null, user);
  });
}

module.exports = addMiddlewares;
