const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const shemaPost = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Body: {
    type: String,
    required: true,
  },
  photo: {
    data: Buffer,
    contenType: String,
  },
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Post", shemaPost);
