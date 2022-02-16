const allUser = require("../Model/dataschema")
const {regval} = require("../helper/validation")
const multer = require("multer")
const bcrypt = require("bcrypt")
const path = require("path")
const jwt = require("jsonwebtoken")
const {signAccessToken} = require("../helper/jwt_hepler")
const { create } = require("../Model/dataschema")




const regUser = async (req, res)=>{
  try{

    const value = await regval.validateAsync(req.body)
    if(value.error){
       return res.status(400).json({message: value.error.details[0].message})
    }

    const emailChecker = await allUser.findOne({email:value.email}).exec()
    if(emailChecker){
          return res.status(401).json({message:"email alrady exist in data base"})
    }
    
    const {fullName, email, password, avatar,id } = req.body
    const salt =  await bcrypt.genSalt(10)
    const hashpassword = await bcrypt.hash(password, salt)

    const createUser = await allUser.create({
      id: allUser.length + 1,
      fullName,
      email,
      password:hashpassword,
      avatar:req.file.path
    })
    res.status(201).json({data: createUser})
  }catch(error){
   res.status(400).json({error: error.message})
  }
}


const getAll = async (req, res)=>{
    try{
      const allData = await allUser.find()
      res.status(200).json({allData})

    }catch(error){
      res.status(400).json({message :"opps somethigng went wrong"})
    }
}

const getOne = async (req, res)=>{
  const { id} = req.params
  try{
     const getIn = await allUser.findById(id)
     res.status(200).json({message:"user Found", data: getIn})
  }catch(error){
    res.status(400).json({message: "opps something went wrong"})
  }
}

const Login = async (req, res)=>{
  try{
    const {email} = req.body
    const user = await allUser.findOne({email})

    if(user){
      const checkPassword = await bcrypt.compare(req.body.password, user.password);
      if(checkPassword){
        const {password, ...info} = user._doc
        const token = signAccessToken({
          id:user._id,
          email:user.email,
          fullName:user.fullName,
          isAdmin:user.isAdmin
        })

        res.status(200).json({
          message : `welcome back ${user.fullName}`,
          data:{...info, token}
        })

      }else{
        res.status(401).json({message:"password is incorrect"})
      }
    }else{
      res.status(401).json({message : "user is not register"})
    }
  }catch(error){
    res.status(400).json({mesage: error.message})
  }
}



const delet = async(req, res)=>{
 try{
   if(req.user.isAdmin){
      const user = await allUser.findByIdAndDelete(req.params.id, req.body) 
      res.status(200).json({message:"deleted sucessfully"})

   }else{
     res.status(400).json({message:"you are not an admin"})
   }

 }catch(error){
   res.status(400).json({message:error.message})
 }
}

const updateUser = async(req, res)=>{
  try{
    if(req.user.id === req.params.id || req.user.isAdmin){
      const user = await allUser.findByIdAndUpdate(req.params.id,
        {
          fullName: req.body.fullName
        },
        {new : true}
        );
        res.status(200).json({
          message: "user updated",
          data: user,
        })
    }
  }catch(error){
    res.status(400).json({message: error.message})
  }

}




module.exports={
  regUser,
  getAll,
  getOne,
  Login,
  delet,
  updateUser
}