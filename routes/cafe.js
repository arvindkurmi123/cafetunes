const express = require("express");
const router = express.Router();

const {isLoggedIn, isOwner, validateListing, isCafeOwner} = require("../middleware.js");
const Cafe = require("../models/cafe.js");

router.get("/",async(req,res)=>{
    const allCaves = await Cafe.find({});
    res.render("caves/index.ejs", { allCaves });
});
router.get("/:id",isLoggedIn,async(req,res)=>{
    let {id} = req.params;
    let cafeInfo = await Cafe.findOne({_id:id});
    cafeInfo = await cafeInfo.populate("owner");
    // console.log("cafeInfo in cafe.js /:id route",cafeInfo);
    res.render("caves/showCafe.ejs",{cafeInfo});
})

module.exports = router;