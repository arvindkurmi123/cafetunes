const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/expressError.js");

module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.isAuthenticated());
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to change or create a listing!");
        return res.redirect("/login");
    }
    next();
}

// since passport(middleware) reinitialize the value of req object, so we can't use the value of req.session.redirectUrl after signup or login process. So we have to create a new middleware for the same thing and save the req.session.redirectUrl value inside res.locals

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) =>{
    let result = listingSchema.validate(req.body);
    if(result.error){
      let errMsg = result.error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }
  };

// validate review function as middleware
module.exports.validateReview = (req,res,next) =>{
    let result = reviewSchema.validate(req.body);
    if(result.error){
      let errMsg = result.error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }
  };

  module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isCafeOwner = async (req,res,next)=>{
  let {cafeOwnerId} = req.params;
  let user = res.locals.currUser;
  if( user.userType === "cafeOwner"){
    if(cafeOwnerId === user._id.toString()){
        return next();
    }
  }
  // req.flash("error","You are not the owner of this Cafe! this line is for development purpose only");
  return res.redirect(`/owners/${user._id}`);
}