const User = require("../models/user");
const cafeOwner = require("../models/cafeOwner");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.registerUser = async(req,res)=>{
    try{
        let {username, email, password, type} = req.body;
        
        if(type === "cafeOwner"){
            let newCafeOwner = new cafeOwner({email});
            console.log(newCafeOwner);
            let UT = {
                type: type,
                userId:newCafeOwner._id
            }
            let newUser = new User({email,UT,username});
            let registeredUser = await User.register(newUser,password);
            console.log(registeredUser);
            console.log(newCafeOwner);
            await newCafeOwner.save();
            
            req.login(registeredUser,(err)=>{
                if(err){
                    return next(err);
                }
                req.flash("success","Welcome to wanderlust");
                // res.send("cafeOWNER");
                res.redirect(`/listings/owner/${newCafeOwner._id}`);
                return;
            })
        }
        else{
            req.login(registeredUser,(err)=>{
                if(err){
                    return next(err);
                }
                req.flash("success","Welcome to wanderlust");
                res.redirect("/listings");
            })
        }
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginUser = async (req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    })
    req.flash("success","you are now logged out!");
    res.redirect("/listings");
};