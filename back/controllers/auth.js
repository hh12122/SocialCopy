const jwt = require("jsonwebtoken");
require("dotenv").config();
const { expressjwt: jwto } = require("express-jwt");
const User = require("../models/user");
const _ = require("lodash");

exports.signup = (req, res) => {
  //  console.log('req.body', req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user,
    });
  });
};

exports.signin = (req, res) => {
  //find the user based email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    //if err or no user
    if (err || !user) {
      return res.status(400).json({
        error: "user deos not existe",
      });
    }

    //if user is found make sure emal and password match

    //create autheticate methode in model and use here

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "email password not right",
      });
    }
    //generate a token withe user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //perssist the oken as 't' in cookie with expiry date

    res.cookie("t", token, { expire: new Date() + 9999 });
    //return respons with user and token to frontend client
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, email, name } });
  });
};
exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({ message: "signout succesful" });
};
exports.requireSignin = jwto({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});
