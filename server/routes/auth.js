const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../key");
const requireLogin = require("../middleware/requireLogin");
const nodemailer = require("nodemailer"); //Use nodemailer. createTransport() function to create a transporter who will send mail. It contains the service name and authentication details
//const sendgridTransport =require('nodemailer-sendgrid-transport')
const sgMail = require("@sendgrid/mail"); //SendGrid is a cloud-based SMTP provider that allows you to send email without having to maintain email servers.
const crypto = require("crypto"); //CryptoJS is a growing collection of standard and secure cryptographic algorithms implemented in JavaScript using best practices and patterns.

// const transporter = nodemailer.createTransport(sendgridTransport({
//     // auth:{
//     //     api_key:"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"
//     // }

// }))
sgMail.setApiKey(
  "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"
);
router.get("/protected", requireLogin, (req, res) => {
  res.send("hell");
});

router.post("/signup", (req, res) => {
  //The router. use() function uses the specified middleware function or functions. It basically mounts middleware for the routes which are being served by the specific router.                                       //here post route is to posting data like name ,email password...
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "enter all the flieds" }); // 422 error is server has undserstood request but  server can't process
  }
  User.findOne({ email: email }) // finding here user new/exsist with email
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already exists with that email " });
      }
      bcrypt
        .hash(password, 15) // bcrypt packge is used for has the password here
        .then((hashedpassword) => {
          const user = new User({
            email,
            password: hashedpassword,
            name,
            pic,
          });
          user
            .save()
            .then((user) => {
              const msg = {
                to: user.email,
                from: "muppasaikrishna@gmail.com", // Use the email address or domain you verified above
                subject: "Signup succesfull",
                html: "<h1>Welcome to Instapost<h1>",
              };
              //ES6
              sgMail.send(msg).then(
                () => {
                  console.log("email sent succesfully");
                },
                (error) => {
                  console.error(error);

                  if (error.response) {
                    console.error(error.response.body);
                  }
                }
              );

              //   transporter.sendMail({
              //       to:user.email,
              //       from:"no-reply@instapost.com",
              //       subject:"signup successfully",
              //       html:"<h1>Instapost</h1>"
              //   })
              res.json({ message: "signup successfully" });
            })
            .catch((err) => {
              console.log(err);
            });
        });
    })
    .catch((err) => console.log(err));
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "enter email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "invalid email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({message:"successfully Logged In"})
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, followers, following, pic } = savedUser;
          res.json({
            token,
            user: { _id, name, email, followers, following, pic },
          });
        } else {
          return res.status(422).json({ error: "ivalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.post("/reset-password", (req, res) => {
  console.log(req.body, "reset");
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      console.log(user, "user");
      if (!user) {
        return res.status(422).json({ error: "user don't exists with email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((user) => {
        const msg = {
          to: user.email,
          from: "muppasaikrishna@gmail.com", // Use the email address or domain you verified above
          subject: "Reset password",
          html: `<h2> click on this <a href="http://localhost:3000/reset/${token}">link</a> to reset-password </h2>`,
        };
        //ES6
        sgMail.send(msg).then(
          () => {
            console.log("email sent succesfully");
          },
          (error) => {
            console.error(error);

            if (error.response) {
              console.error(error.response.body);
            }
          }
        );
        // transporter.sendMail({
        //     to:user.email,
        //     from:"muppasaikrishna562@gmail.com",
        //     subject:"password-reset",
        //     html:`
        //     <h5> click in this <a href="http://localhost:3000/reset/${token}">link</a>to reset </h5>`
        // })
        res.json({ message: "check your email" });
      });
    });
  });
});

router.post("/new-password", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "try again some time" });
      }
      bcrypt.hash(newPassword, 15).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUser) => {
          res.json({ message: "password updated succesfully" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
