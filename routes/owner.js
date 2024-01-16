const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing, isCafeOwner} = require("../middleware.js");
const Cafe = require("../models/cafe.js");
const User = require("../models/user.js");

router.get("/new",(req,res,next)=>{
    try{
        let ownerId = res.locals.currUser._id;
        console.log(res.locals.currUser);
        res.render("cafes/newCafe.ejs",{ownerId});
    }catch(e){
        req.flash("success","New Listing created!");
        next();
    }
});
router.post("/:cafeOwnerId", async(req,res)=>{
    const newCafe = new Cafe(req.body.cafe);
    newCafe.owner = req.params.cafeOwnerId;
    await newCafe.save();
    console.log("newCafe info"+newCafe);
    const user = await User.find({_id:req.params.cafeOwnerId});
    if(!user){
        req.flash("error","You should register first!");
        return res.redirect("/signup");
    }

    // console.log("updated User info"+user);

    // User.updateOne({ _id: req.params.cafeOwnerId }, { $set: { userId: newCafe._id } }, (err, result) => {
    //     if (err) {
    //       // Handle error
    //       console.error(err);
    //       return next(err);
    //     } else {
    //         return res.redirect(`/owners/${newCafe.owner}`);
    //         console.log(result);
    //     }
    // });
    // console.log("updated User info"+user);
    res.redirect(`/owners/${newCafe.owner}`);
});
router.get("/:cafeOwnerId",isLoggedIn,isCafeOwner, async(req,res)=>{
    let {cafeOwnerId} = req.params;

    const newCafeInfo = await Cafe.find({owner:cafeOwnerId});
   console.log(newCafeInfo[0]);
   let cafeInfo = newCafeInfo[0];
    res.render("cafes/showCafe.ejs",{cafeInfo});
});

module.exports = router;
