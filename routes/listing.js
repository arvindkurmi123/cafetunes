const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing, isCafeOwner} = require("../middleware.js");
const Cafe = require("../models/cafe.js");
const ListingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


// index route, create route
router
    .route("/")
    .get( wrapAsync(ListingController.index))
    .post(isLoggedIn, upload.single('listing[image]'),validateListing,wrapAsync(ListingController.createListing));

//New Route
router.get("/new", isLoggedIn, ListingController.renderNewForm);

// show route ,update route, deleteroute
router
    .route("/:id")
    .get( wrapAsync(ListingController.showListing))
    .put(isLoggedIn, isOwner,upload.single('listing[image]'),validateListing, wrapAsync(ListingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(ListingController.destroyListing));


//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(ListingController.renderEditForm));

// cafeOwnerIndexRoute
// router.get("/:id/:cafeOwnerId", isLoggedIn,isOwner, wrapAsync(ListingController.renderEditForm));

module.exports = router;