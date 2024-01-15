const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    UT:{
        type:{
            type: String,
            enum: ['normalUser','cafeOwner','singer'],
            required: true,
        },
        userId:{
            type : Schema.Types.ObjectId,
            ref : "CafeOwner" || "NormalUser"||"Singer"
        }
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports  = mongoose.model("User",userSchema);