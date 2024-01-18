const User = require("../models/user");
const cafeOwner = require("../models/cafeOwner");
const Cafe = require("../models/cafe");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.registerUser = async(req,res)=>{
    try{
        let {username, email, password, type} = req.body;
        let userType = type;
        let newUser = new User({email,userType,username});
        let registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            // for cafeowner
            if(type === "cafeOwner"){
                req.flash("success","Welcome to cafetunes! Register your Cafe!");
                res.redirect(`/owners/new`);
            }
            // singer
            else if(type == 'singer'){
                req.flash("success","Welcome to cafetunes! Register yourself as a snger!");
                res.redirect(`/singers/new`);
            }
            // for normaluser
            else if(type == 'normalUser'){
                req.flash("success","Welcome to cafetunes!");
                res.redirect(`/caves`);
            }
            else{
                req.flash("error","you are here due to some mistake as you are not registered as any type of user");
                res.redirect("/");
            }
            return;
        })
        
        
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginUser = async (req,res)=>{
    req.flash("success","Welcome back to Cafetunes!");
    let redirectUrl = res.locals.redirectUrl;
    if(!redirectUrl){
        
        if(req.user.userType === 'cafeOwner'){
            let cafe = await Cafe.findOne({owner:req.user._id});
            return res.redirect(`/owners/${cafe.owner}`);
        }
        else if(req.user.userType === 'singer'){
            // let cafe = await Cafe.findOne({owner:req.user._id});
            // return res.redirect(`/singers/${cafe.owner}`);
            return res.send("login path for singer is not given in controllers");
        }
        else if(req.user.userType === 'normalUser'){
            return res.redirect(`/caves`);
        }
        else{
            return res.send("login path for singer or normal user is not given in controllers");
        }
    }
    else{
        redirectUrl = redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
    
};

module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    })
    req.flash("success","you are now logged out!");
    res.redirect("/caves");
};