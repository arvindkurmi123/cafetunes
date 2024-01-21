const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing, isCafeOwner } = require("../middleware.js");
const Cafe = require("../models/cafe.js");
const User = require("../models/user.js");
const Singer = require("../models/singer.js");
const Event = require("../models/event.js");



// new registration as singer
router.get("/new",isLoggedIn, async(req, res, next) => {
    try {
        let singerId = res.locals.currUser._id;
        console.log(res.locals.currUser);
        if(res.locals.currUser.userType=="normalUser"){
            let user = await User.findOne({_id: singerId});
            user.userType = "singer";
            await user.save();
        }
        res.render("singers/new.ejs", { singerId });
    } catch (e) {
        req.flash("error", "error occured while creating you an singer!");
        console.log(e);
        res.redirect("/caves");
    }
});
// edit route
router.get("/:id/edit",isLoggedIn,async(req,res)=>{
  let singer = await Singer.findOne({userId:res.locals.currUser._id});
  // console.log(singer);
  res.render("singers/edit.ejs",{singer});
})

// 


// new singer registration

// ----- we can also add singervalidation here (for both singer and req.body.singer)
router.post("/:id",isLoggedIn,async(req,res)=>{
    let {id} = req.params;
    let singer = new Singer(req.body.singer);
    if(!singer.userId) singer.userId = id;
    console.log("mohalla me naya singer aaya bajao tali",singer,id);
    await singer.save();
    res.redirect(`/singers/${id}`);
})
router.get("/:id",isLoggedIn,async(req,res)=>{
    let {id} = req.params;
    let singer = await Singer.findOne({userId:id});
    singer.events = singer.events.reverse();
    console.log("to ye hai singeer saab jinki profile dikhani hai",singer);
    singer = await singer.populate("userId");
    singer = await singer.populate({path:"reviews",populate:"author"});
    singer = await singer.populate({path:"events",populate:"cafe"});
    console.log(singer);
    console.log("currUser",res.locals.currUser);
    res.render("singers/profile.ejs",{singer});
})

router.get("/:id/event/:eventId",isLoggedIn,async(req,res)=>{
  let {id,eventId} = req.params;
  console.log("taking stage: singerId",id," eventId",eventId);
  let singer = await Singer.findOne({userId:id});
  let event = await Event.findOne({_id:eventId});
  event.hasSinger = true;
  event.singer = singer;
  singer.events.push(event);
  await event.save();
  await singer.save();
  // res.send("need to create a page where all the events will be shown where the user has taken the stages");
  res.redirect(`/singers/${id}`);
});
router.post("/:id/edit",isLoggedIn,async(req,res)=>{
  let {id} = req.params;
  let singer = await Singer.findByIdAndUpdate(id,{... req.body.singer});
  await singer.save();
  res.redirect(`/singers/${singer.userId}`);
});


router.get("/:id/participate",isLoggedIn,async(req,res)=>{
  let {id} = req.params;
  let allEvents = await Event.find({hasSinger:false});
  res.render("events/index.ejs",{allEvents});
});


module.exports = router;
