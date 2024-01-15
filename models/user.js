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
            enum: [
                {
                    type : Schema.Types.ObjectId,
                    ref : "normalUser"
                },
                {
                    type : Schema.Types.ObjectId,
                    ref : "cafeOwner"
                },
                {
                    type : Schema.Types.ObjectId,
                    ref : "singer"
                }
            ]
        }
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports  = mongoose.model("User",userSchema);