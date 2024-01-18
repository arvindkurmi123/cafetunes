const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({path :"reviews",populate : {path:"author"}})
        .populate("owner");

    // console.log(listing);
    if(!listing){
        req.flash("error","Listing you have requested, does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient
    .forwardGeocode({
        query:req.body.listing.location,
        limit : 1,
    })
    .send();
    let url = req.file.path;
    let filename = req.file.finename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = res.locals.currUser.userId;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    // console.log(newListing);
    await newListing.save();
    req.flash("success","New Listing created!");
    res.redirect(`/listings/owner/${res.locals.currUser.userId}`);
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you have requested, does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    // console.log(originalImageUrl);
    res.render("listings/edit.ejs", { listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "send valid data for listing")
    }
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    let response = await geocodingClient
    .forwardGeocode({
        query:req.body.listing.location,
        limit : 1,
    })
    .send();
    // console.log(response.body.features[0].geometry);
    listing.geometry = response.body.features[0].geometry;

    if(typeof req.file !== 'undefined'){
        let url = req.file.path ;
        let filename = req.file.filename;
        listing.image = {url,filename};
    }
    await listing.save();
    req.flash("success","Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success","Listing deleted successfully!");
    res.redirect("/listings");
};