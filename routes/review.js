const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");

// Post Reviews Route
router.post("/", isLoggedIn,validateReview, wrapAsync(ReviewController.createReview));

//Delete review route
router.delete("/:reviewId",isReviewAuthor, wrapAsync(ReviewController.destroyReview));

module.exports = router;