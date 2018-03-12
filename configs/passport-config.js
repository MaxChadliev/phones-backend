const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

const UserModel = require("../models/user-model");

// Save the user's ID (called when user logs in)
passport.serializeUser((userFromDb, next) => {
  next(null, userFromDb._id);
});

// Retrieve the user's info from the DB with the ID
passport.deserializeUser((userId, next) => {
  UserModel.findById(userId, (err, userFromDb) => {
    if (err) {
      next(err);
      return;
    }

    next(null, userFromDb);
  });
});

// username & password login strategy
passport.use(
  new LocalStrategy(
    // loginUsername and loginPassword are fields that we use to check if our login works
    {
      usernameField: "loginUsername", // sent through AJAX from Angular
      passwordField: "loginPassword" // sent through AJAX from Angular
    },
    (theUsername, thePassword, next) => {
      UserModel.findOne({ username: theUsername }, (err, userFromDb) => {
        if (err) {
          next(err);
          return;
        }

        if (userFromDb === null) {
          next(null, false, { message: "Incorrect username." });
          return;
        }

        if (
          bcrypt.compareSync(thePassword, userFromDb.encryptedPassword) ===
          false
        ) {
          next(null, false, { message: "Incorrect password." });
          return;
        }

        next(null, userFromDb);
      });
    }
  )
);
