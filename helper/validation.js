const joi = require("@hapi/joi")

const   regval
= joi.object({
  fullName :joi.string().required().min(5).max(14),
  email:joi.string().email().required().lowercase(),
  password:joi.string().min(8)
  
})

module.exports ={
  regval
}