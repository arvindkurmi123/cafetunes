const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const cafeOwnerSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    events: [
        {
            type : Schema.Types.ObjectId,
            ref : "Listing"
        }
    ]
});


module.exports  = mongoose.model("CafeOwner",cafeOwnerSchema);