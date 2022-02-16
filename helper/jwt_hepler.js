const jwt = require("jsonwebtoken")


function signAccessToken (user){
   return jwt.sign(user, "BUkkYisMyBEAUtyWIfEEEE",{expiresIn:"1d"})
}

module.exports={
  signAccessToken
}