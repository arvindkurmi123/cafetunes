const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing, isCafeOwner } = require("../middleware.js");
const Cafe = require("../models/cafe.js");
const User = require("../models/user.js");
const Event = require("../models/event.js");

router.get("/new", (req, res, next) => {
    try {
        let ownerId = res.locals.currUser._id;
        console.log(res.locals.currUser);
        res.render("cafes/newCafe.ejs", { ownerId });
    } catch (e) {
        req.flash("success", "New Listing created!");
        next();
    }
});
router.post("/:cafeOwnerId", async (req, res) => {
    const newCafe = new Cafe(req.body.cafe);
    newCafe.owner = req.params.cafeOwnerId;
    await newCafe.save();
    console.log("newCafe info" + newCafe);
    const user = await User.find({ _id: req.params.cafeOwnerId });
    if (!user) {
        req.flash("error", "You should register first!");
        return res.redirect("/signup");
    }
    res.redirect(`/owners/${newCafe.owner}`);
});
router.get("/:cafeOwnerId", isLoggedIn, isCafeOwner, async (req, res) => {
    let { cafeOwnerId } = req.params;

    const newCafeInfo = await Cafe.find({ owner: cafeOwnerId });
    console.log(newCafeInfo[0]);
    let cafeInfo = await newCafeInfo[0].populate("owner");
    cafeInfo = await cafeInfo.populate({ path: "reviews", populate: { path: "author" } });
    cafeInfo = await cafeInfo.populate({path : "events", populate:{path: "reviews"}});
    
    console.log("cafeInfo in owner.js /:cafeOwnerId route",cafeInfo);
    res.render("owners/index.ejs", { cafeInfo });
});
router.get("/:cafeOwnerId/events/new",isLoggedIn,isCafeOwner,(req,res)=>{
    let {cafeOwnerId} = req.params;
    res.render("events/new.ejs",{cafeOwnerId});
})
router.post("/:cafeOwnerId/events",isLoggedIn,isCafeOwner,async(req,res)=>{
    let {cafeOwnerId} = req.params;
    let event = new Event(req.body.event);
    console.log(event);
    let user = await User.findOne({_id:cafeOwnerId});
    event.owner = user;
    let cafe = await Cafe.findOne({owner:cafeOwnerId});
    event.cafe = cafe;
    await event.save();
    cafe.events.push(event);
    await cafe.save();
    console.log("the event",event);
    console.log("the cafe",cafe);
    console.log("the user",user);


    // res.send("sent")
    req.flash("success","new event is created successfully");
    res.redirect(`/owners/${cafeOwnerId}`);
})
module.exports = router;
