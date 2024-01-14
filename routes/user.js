const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController = require("../controllers/users.js");

// signup route
router
    .route("/signup")
    .get(UserController.renderSignupForm)
    .post(wrapAsync(UserController.registerUser));


// login route
router
    .route("/login")
    .get(UserController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}),
        UserController.loginUser
    );

router.get("/logout",UserController.logoutUser);

module.exports = router;