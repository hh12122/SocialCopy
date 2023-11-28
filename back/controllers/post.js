const Post = require("../models/posts");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.postById = (req, res, next, id) => {
  Post.findById(id)
    .populate("postedBy", "_id name")
    //.populate("comments.postedBy", "_id name")
    //.populate("postedBy", "_id name role")
    .select("_id title body created ") //likes comments photo
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          error: err,
        });
      }
      req.post = post;
      next();
    });
};

exports.getPosts = (req, res) => {
  const posts = Post.find()
    .populate("postedBy", "_id name")

    .select("_id title body created")
    .sort({ created: -1 })
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => console.log(err));
};

//exports.createPost = (req, res) => {
// const post = new Post(req.Body);
// console.log("creating post : ", post);
//handel erreur dans validator

// post.save((err,result)=>
//   {
//if(err){return res.status(400).json({//
// error: err;
//})}
//return res.status(200).json({
// post:result
//})
//   });
// post.save().then((result) => {
//   return res.status(200).json({
//     post: result,
//  });
//};

exports.createPost = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log("FORM PARSE ERROR", err);

      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    console.log("FORM FIELDS FILES", fields, files);

    let post = new Post(fields);

    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    post.postedBy = req.profile;

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(result);
    });
  });
};
exports.postsByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name")
    .select("_id title body created likes")
    .sort("_created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(posts);
    });
};
exports.isPoster = (req, res, next) => {
  let sameUser = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  let adminUser = req.post && req.auth && req.auth.role === "admin";

  // console.log("req.post ", req.post, " req.auth ", req.auth);
  // console.log("SAMEUSER: ", sameUser, " ADMINUSER: ", adminUser);

  let isPoster = sameUser || adminUser;

  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  console.log("isposter");
  next();
};

exports.updatePost = (req, res, next) => {
  //console.log("update");

  //form.parse(req, (err, fields, files) => {
  //if (err) {
  //  return res.status(400).json({
  //    error: "Photo could not be uploaded",
  //  });
  //}
  // save post
  let post = req.post;
  post = _.extend(post, req.body); //fields);
  post.updated = Date.now();

  //if (files.photo) {
  //  post.photo.data = fs.readFileSync(files.photo.path);
  //  post.photo.contentType = files.photo.type;
  //}

  post.save((err, result) => {
    if (err) {
      console.log("err");
      return res.status(400).json({
        error: err,
      });
    }
    console.log(result);
    res.json(post);
  });
}; //);
//};

exports.deletePost = (req, res) => {
  let post = req.post;
  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "Post deleted successfully",
    });
  });
};

exports.photo = (req, res, next) => {
  res.set("Content-Type", req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

exports.singlePost = (req, res) => {
  return res.json(req.post);
};
