const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const UserController = require("../controllers/users.js");
// Home route
router.get("/",(req,res)=>{
    res.render("Home.ejs")
})

// confirmation route
router.get("/confirmation",isLoggedIn,(req,res)=>{
    if(res.locals.currUser.userType=="normalUser"){
        return res.render("owners/confirm.ejs");
    }else{
        // req.flash("error","you are not authorized to register as owner");
        let message = "wrong redirection, you are not authorized to register as owner"
        res.render("error.ejs",{message})
    }
    
})
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