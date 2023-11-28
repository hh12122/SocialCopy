const express = require("express");
const app = express();
const fs = require("fs");
const morgan = require("morgan");
var cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
dotenv.config();

mongoose
  .connect("mongodb+srv://hocine:0000@social.uxxhps8.mongodb.net/", {
    useNewUrlParser: true,
  })
  .then(() => console.log("database connected"));

mongoose.connection.on("error", (err) => {
  console.log(`database connection failed ${err.message}`);
});

//exmple
// const MyOwnMiddelware = (req, res, next) => {
// console.log(`Middelware applied!!`);
// next();
// };

// app.use(MyOwnMiddelware);

//bring in routes
// const { getPosts } = require("./routes/post.js");
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
// apiDocs
app.get("/api", (req, res) => {
  fs.readFile("docs/apiDocs.json", (err, data) => {
    if (err) {
      res.status(400).json({
        error: err,
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

//Middelware
app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use("/", postRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: "Unauthorized!" });
  }
});
//app.use(function (err, req, res, next) {
//  if (err.name === "UnauthorizedError") {
//    res.statut(401).json({ error: "Unauthorize" });
//  }
//});

const port = 8080;
app.listen(port, () => {
  console.log(`listning on port: ${port} `);
});
