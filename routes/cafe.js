const express = require("express");
const router = express.Router();

const {isLoggedIn, isOwner, validateListing, isCafeOwner} = require("../middleware.js");
const Cafe = require("../models/cafe.js");

router.get("/",async(req,res)=>{
    const allCaves = await Cafe.find({});
    res.render("caves/index.ejs", { allCaves });
});

module.exports = router;