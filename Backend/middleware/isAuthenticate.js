const UserModel = require('../models/userModel');
const jwt=require("jsonwebtoken")
const isAuthenticate=async(req,res,next)=>{
    try{
 const token=req.cookies.token
 if(!token){
     res.status(401).json({message:"User not Authenticated"})
 }
 const decode=await jwt.verify(token,process.env.JWT_SECRET)
  if(!decode){
     res.status(401).json({message:"User not Authenticated"})
  }
  const user=await UserModel.findById(decode.id)    
  req.user=user
  next()
}catch(err){
    console.log(err)
}
}
module.exports=isAuthenticate