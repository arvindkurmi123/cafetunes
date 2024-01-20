const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const singerSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  experience: String,
  photo: String,
  phone:{
    type: Number,
    required: true,
  },
  location: String,
  country: String,
  userId:{
    type : Schema.Types.ObjectId,
    ref : "User"
  },
  reviews:[{
    type : Schema.Types.ObjectId,
    ref : "Review" 
  }],
  events:[{
    type : Schema.Types.ObjectId,
    ref : "Event" 
  }],

});
 

const Singer = mongoose.model("Singer", singerSchema);
module.exports = Singer;
