const mongoose = require("mongoose")

const myUser = mongoose.Schema({
  id:{
    type:Number,
    require:true
  },
  fullName:{
    type:String,
    require:true
  },
  email:{
    type:String,
    require:true
  },
  password:{
    type:String,
    require:true
  },
  avatar:{
    type:String,
    require:true
  },
  isAdmin:{
    type:Boolean,
    default:false
  }
})

const allUser = mongoose.model("user",  myUser)
module.exports = allUser