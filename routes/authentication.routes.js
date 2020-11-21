const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const User = require("../models/User.model");

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const routeGuard = require("../configs/route-guard.config");

//SIGNUP

router.post("/api/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  //   console.log(username, email, password);

  if (!username || !email || !password) {
    res.status(401).json({
      message:
        "All fields are mandatory. Please provide username, email and password.",
    });

    return;
  }

  //Check if password is strong
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).json({
      message:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  //hash the password
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword,
      });
    })
    .then((user) => {
      //   user.passwordHash = undefined;
      //   res.status(200).json({ user });

      req.login(user, (err) => {
        if (err)
          return res
            .status(500)
            .json({ message: "Something went wrong with login." });
        user.passwordHash = undefined;
        res.status(200).json({ message: "Login successful!", user });
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(500).json({ message: err.message });
      } else if (err.code === 11000) {
        res.status(500).json({
          message:
            "Username and email need to be unique. Either username or email is already used.",
        });
      } else {
        next(err);
      }
    });
});

//LOGIN

router.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, failureDetails) => {
    if (err) {
      res.status(500).json({ message: "Broken database query." });
      return;
    }

    if (!user) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(user, (err) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Something went wrong with login." });
      user.passwordHash = undefined;
      res.status(200).json({ message: "Login successful!", user });
    });
  })(req, res, next);
});

//LOGOUT

router.post("/api/logout", (req, res, next) => {
  req.logout();
  res.status(200).json({ message: "Logout successful!" });
});

//CHECK IF USER IS LOGGED IN

router.get("/api/isLoggedIn", (req, res) => {
  console.log("user u isLoggedIn: ", req.user);
  if (req.user) {
    req.user.passwordHash = undefined;
    res.status(200).json({ user: req.user });
    return;
  }
  res.status(401).json({ message: "Unauthorized access!" });
});

//UPDATE PROFILE

//.post() profile route ==> to process updated profile data
router.post("/api/edit-profile", (req, res, next) => {
  console.log("got here");
  const { username: proposedUser, email: proposedEmail } = req.body;
  // const  = username;
  // const  = email;
  console.log(proposedEmail, proposedUser);
  //check to make sure at least one field is filled out
  if (!proposedUser && !proposedEmail) {
    res.status(400).json({
      message:
        "Please update at least one field to save changes to your profile.",
    });
  }

  //if username was updated:
  if (proposedUser) {
    // console.log(proposedUser);
    User.findByIdAndUpdate(
      req.user._id,
      {
        username: proposedUser,
      },
      {
        new: true,
      }
    )
      .then((updatedUser) => {
        console.log(`username updated: ${updatedUser}`);
        res.status(200).json({ user: updatedUser });
      })
      .catch((err) => {
        //check that username is unique:
        console.log({ err });
        if (err.code === 11000) {
          res.status(500).json({
            message:
              "Username and email need to be unique. Either username or email is already used.",
          });
        } else console.log(`error updating username: ${err}`);
      });
  }

  //if email was updated:
  if (proposedEmail) {
    // console.log(proposedEmail);
    User.findByIdAndUpdate(
      req.user._id,
      {
        email: proposedEmail,
      },
      {
        new: true,
      }
    )
      .then((updatedUser) => {
        console.log(`user email updated: ${updatedUser}`);
        res.status(200).json({ user: updatedUser });
      })
      .catch((err) => {
        console.log({ err });

        //check that email is unique:
        if (err.code === 11000) {
          res.status(500).json({
            message:
              "Username and email need to be unique. Either username or email is already used.",
          });
        } else console.log(`error updating email: ${err}`);
      });
  }

  //if password was updated:
  // if (proposedPassword) {
  //   // console.log(proposedPassword);
  //   // make sure passwords are strong:
  //   if (!regex.test(proposedPassword)) {
  //     res.status(500).json({
  //       message:
  //         "New password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
  //     });
  //     return;
  //   }
  //   //hash the new password:
  //   bcryptjs
  //     .genSalt(saltRounds)
  //     .then((salt) => bcryptjs.hash(proposedPassword, salt))
  //     //update the user with the new password
  //     .then((hashedPassword) => {
  //       User.findByIdAndUpdate(
  //         req.session.loggedInUser._id,
  //         {
  //           password: hashedPassword,
  //         },
  //         {
  //           new: true,
  //         }
  //       );
  //     })
  //     .then((updatedUser) => {
  //       console.log("user password has been updated.");
  //       // res.redirect('/profile');
  //     })
  //     .catch((error) => {
  //       if (error instanceof mongoose.Error.ValidationError) {
  //         res.status(500).json({
  //           message: error.message,
  //         });
  //       } else {
  //         next(error);
  //       }
  //     });
  // }
});

module.exports = router;
