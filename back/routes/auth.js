const express = require("express");

const { signup, signin, signout } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { userSignupValidator, userSigninValidator } = require("../validator");
const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", userSigninValidator, signin);
router.get("/signout", signout);
//any route contannin user id  our app will run userbyid
router.param("userId", userById);
module.exports = router;
