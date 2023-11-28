const mongoose = require("mongoose");

const uuidv1 = require("uuid").v1;

const crypto = require("crypto");

const userShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now,
  },
  Updated: Date,
});

//vituel attibut
userShema
  .virtual("password")
  .set(function (password) {
    //creer password temporary
    this._password = password;
    //generate timesstamp
    this.salt = uuidv1();
    //encrypt pass
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this.password;
  });

//methode

userShema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) == this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userShema);
