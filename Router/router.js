const express = require("express")
const multer = require("multer")
const jwt = require("jsonwebtoken")
const path = require("path")
const route = express.Router()

const {regUser, getAll, getOne, Login, delet,updateUser} = require("../Controller/conrols")



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname) )
  }
})
const uploads = multer({ storage: storage }).single("image")


const verify = async (req, res, next)=>{
  try{
    const authToken = req.headers.authorization
    if(authToken){
      const token = authToken.split(" ")[2]
      jwt.verify(token, "BUkkYisMyBEAUtyWIfEEEE", (error, payload)=>{
        if(error){
          res.status(400).json({message:"please check your token again"})
        }else{
          req.user = payload,
          next()
        }
      })

    }else{
      res.status(400).json({message:"something is wrong with this token"})
    }

  }catch(error){
    res.status(400).json({message :"you don't have the right for this operation"})
  }
}

route.post("/register", uploads, regUser )
route.get("/", getAll)
route.get("/:id", getOne)
route.post("/login", Login)
route.delete("/user/:id", verify, delet)
route.patch("/user/:id", verify, updateUser)

module.exports = route