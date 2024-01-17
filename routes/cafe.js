const express = require("express");
const router = express.Router();
const {isLoggedIn, isOwner, isReviewAuthor, validateReview} = require("../middleware.js");
const Cafe = require("../models/cafe.js");
const Review = require("../models/review");
router.get("/",async(req,res)=>{
    const allCaves = await Cafe.find({});
    res.render("caves/index.ejs", { allCaves });
});
router.get("/:id",isLoggedIn,async(req,res)=>{
    let {id} = req.params;
    let cafeInfo = await Cafe.findOne({_id:id});
    cafeInfo = await cafeInfo.populate("owner");
    cafeInfo = await cafeInfo.populate({path :"reviews",populate : {path:"author"}});
    console.log("cafeInfo in cafe.js /:id route",cafeInfo);
    res.render("caves/showCafe.ejs",{cafeInfo});
})
router.post("/:id/reviews",isLoggedIn,validateReview,async(req,res)=>{
    console.log(req.body);
    let cafe = await Cafe.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    cafe.reviews.push(newReview);
    console.log(cafe);
    await newReview.save();
    await cafe.save();
    console.log("new review saved");
    req.flash("success","New review created!");
    res.redirect(`/caves/${req.params.id}`);
});

router.delete("/:id/reviews/:reviewId",isReviewAuthor, async (req, res) => {
    let { id, reviewId } = req.params;
    await Cafe.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully!");
    res.redirect(`/caves/${id}`)
});

module.exports = router;