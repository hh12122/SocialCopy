const express = require("express");

const {
  getPosts,
  postsByUser,
  createPost,
  postById,
  isPoster,
  updatePost,
  deletePost,
  singlePost,
} = require("../controllers/post");
const { userById } = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");
const { createPostValidator } = require("../validator");
const router = express.Router();

router.get("/posts", requireSignin, getPosts);

router.get("/posts/by/:userId", requireSignin, postsByUser);

router.post(
  "/post/new/:userId",
  requireSignin,
  createPost,
  createPostValidator
);
router.get("/post/:postId", singlePost);
router.put("/post/:postId", requireSignin, isPoster, updatePost);
router.delete("/post/:postId", requireSignin, isPoster, deletePost);
//any route contannin user id  our app will run userbyid
router.param("userId", userById);
// any route containing :postId, our app will first execute postById()
router.param("postId", postById);
module.exports = router;
