const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing, isCafeOwner } = require("../middleware.js");
const Cafe = require("../models/cafe.js");
const User = require("../models/user.js");
const Singer = require("../models/singer.js");

//test route
router.get("/profile",(req,res)=>{
    let singer = {
        _id: ("65ab2407e381eb8da09729b9"),
        fullName: 'Arvind Kurmi',
        experience: 'sdfjoasdf',
        photo: 'https://pics.craiyon.com/2023-07-15/dc2ec5a571974417a5551420a4fb0587.webp',
        phone: 7,
        about: "I am a simple singer, I have a good skills and experience in this area,I am a stage performer",
        location: 'Hatta, damoh',
        country: 'India',
        reviews: [],
        events: [{
            _id: ("65a944bd25ef02423b5750f6"),
            title: 'Tuning Evening',
            description: 'Join us for an intimate evening at Cafetunes, where the soulful melodies of local singers transform our cozy cafe into a haven of live music. Sip on your favorite brew, savor delectable treats, and let the tunes serenade you for a truly enchanting night out.',
            image: 'https://images.pexels.com/photos/7149156/pexels-photo-7149156.jpeg',
            price: null,
            date: '18/01/2024',
            time: '6:45',
            reviews: [
                {
                    _id: ("65a83bc51bf501b03435a65f"),
                    comment: 'nice place do come!',
                    rating: 5,
                    createdAt: ("2024-01-17T20:41:39.548Z"),
                    author: {
                        _id: ("65ab2386e381eb8da09729ab"),
                        email: 'demo15@gmail.com',
                        userType: 'singer',
                        username: 'demo28',
                      },
                    __v: 0
                  },
                  {
                    _id: ("65a843dcbe20275cd97129e8"),
                    comment: 'wow 56!',
                    rating: 4,
                    createdAt: ("2024-01-17T21:16:38.419Z"),
                    author: {
                        _id: ("65ab1ed86dfc465b80262a07"),
                        email: 'demo@gmail.com',
                        userType: 'singer',
                        username: 'demo27',
                    },
                    __v: 0
                  },
                  {
                    _id: ("65a9512e9a0acb568a465c44"),
                    comment: 'cool',
                    rating: 3,
                    createdAt: ("2024-01-18T16:17:07.306Z"),
                    author: {
                        _id: ("65ab1ed86dfc465b80262a07"),
                        email: 'demo@gmail.com',
                        userType: 'singer',
                        username: 'demo27',
                    },
                    __v: 0
                  }
            ],
            owner: {
                _id: ("65ab1ed86dfc465b80262a07"),
                email: 'demo@gmail.com',
                userType: 'singer',
                username: 'demo27',
            },
            cafe: {
                _id: ("65ab16c2386d92113811bfd6"),
                title: 'cafe Patta',
                description: 'dkjfalsdfksjdflksfsdkfj',
                image: 'https://travelophia.com/wp-content/uploads/2023/02/Chappan-Dukan.jpg',
                phone: 2323,
                location: 'Jaipur, Rajasthan',
                country: 'India',
                reviews: [],
                events: [],
                owner:("65ab16a9386d92113811bfc8"),
                __v: 0
              },
            __v: 6
          },
          {
            _id:("65a944bd25ef02423b5750f6"),
            title: 'Tuning Evening',
            description: 'Join us for an intimate evening at Cafetunes, where the soulful melodies of local singers transform our cozy cafe into a haven of live music. Sip on your favorite brew, savor delectable treats, and let the tunes serenade you for a truly enchanting night out.',
            image: 'https://images.pexels.com/photos/7149156/pexels-photo-7149156.jpeg',
            price: null,
            date: '18/01/2024',
            time: '6:45',
            reviews: [
                {
                    _id:("65a83bc51bf501b03435a65f"),
                    comment: 'nice place do come!',
                    rating: 5,
                    createdAt: ("2024-01-17T20:41:39.548Z"),
                    author:{
                        _id:("65ab1ed86dfc465b80262a07"),
                        email: 'demo@gmail.com',
                        userType: 'singer',
                        username: 'demo27',
                    },
                    __v: 0
                  },
                  {
                    _id:("65a843dcbe20275cd97129e8"),
                    comment: 'wow 56!',
                    rating: 4,
                    createdAt: ("2024-01-17T21:16:38.419Z"),
                    author: {
                        _id:("65ab2386e381eb8da09729ab"),
                        email: 'demo15@gmail.com',
                        userType: 'singer',
                        username: 'demo28',
                      },
                    
                  },
                  {
                    _id:("65a9512e9a0acb568a465c44"),
                    comment: 'cool',
                    rating: 3,
                    createdAt: ("2024-01-18T16:17:07.306Z"),
                    author: {
                        _id:("65ab2386e381eb8da09729ab"),
                        email: 'demo15@gmail.com',
                        userType: 'singer',
                        username: 'demo28',
                      },
                    __v: 0
                  }
            ],
            owner: {
                _id: ("65ab2386e381eb8da09729ab"),
                email: 'demo15@gmail.com',
                userType: 'singer',
                username: 'demo28',
              },
            cafe: {
                _id: ("65ab1158d51d75bdbf7f3a95"),
                title: 'Brewed Bliss',
                description: 'fjasldkfjasdfja;lskdfjalsdfjlskdjflsjdfoasjfadfj',
                image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y2FmZXxlbnwwfHwwfHx8MA%3D%3D',
                phone: 393,
                location: 'Jaipur, Rajasthan',
                country: 'India',
                reviews: [],
                events: [],
                owner: ("65ab1140d51d75bdbf7f3a87"),
                __v: 0
              },
            __v: 6
          },],
        userId: {
          _id: ("65ab2386e381eb8da09729ab"),
          email: 'demo15@gmail.com',
          userType: 'singer',
          username: 'demo28',
          __v: 0
        },
        __v: 0
      };
    res.render("singers/profile.ejs",{singer});
})
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

// new singer registration
router.post("/:id",isLoggedIn,async(req,res)=>{
    let {id} = req.params;
    let singer = new Singer(req.body.singer);
    singer.userId = id;
    console.log("mohalla me naya singer aaya bajao tali",singer,id);
    await singer.save();
    res.redirect(`/singers/${id}`);
})
router.get("/:id",isLoggedIn,async(req,res)=>{
    let {id} = req.params;
    let singer = await Singer.findOne({userId:id});
    console.log("to ye hai singeer saab jinki profile dikhani hai",singer);
    singer = await singer.populate("userId");
    singer = await singer.populate({path:"reviews",populate:"author"});
    singer = await singer.populate({path:"events",populate:"cafe"});
    console.log(singer);
    res.render("singers/profile.ejs",{singer});
})
module.exports = router;
