const bcrypt = require('bcrypt');
const UserModel = require('../models/userModel');
const jwt=require("jsonwebtoken")

const registerUser=async(req,res)=> {
    const {username, fullname,  password,profilephoto}=req.body
    console.log({username, fullname,  password})
    if(!username || !fullname  || !password||!profilephoto) {
        return res.status(400).json({message:"All fields are required"})
    }
    if(username.length<5||password.length<8||fullname.length<5) {
        return res.status(400).json({message:"Username, password and fullname must be at least 8 characters"})
    }
    const isUserExist = await UserModel.findOne({username});
    if (isUserExist) {
        return res.status(400).json({message:"User already exists"})
    }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new UserModel({
    username,
    fullname,
    profilephoto,
    password: hashedPassword
  });
  await user.save();
  const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
  res.cookie("token",token,{httpOnly:true,maxAge:24*60*60*1000})
  
 return  res.status(201).json({message:"User registered successfully",token,user})
}
const loginUser=async(req,res)=>{

    const {username,password}=req.body
    const user=await UserModel.findOne({username})
    if(!user) {
        return res.status(400).json({message:"User not found"})
    }
    const isPasswordValid=await bcrypt.compare(password,user.password)
    if(!isPasswordValid) {
        return res.status(400).json({message:"User not found"})
    }
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
    res.cookie("token",token,{httpOnly:true})
    res.status(200).json({message:"User logged in successfully",token,user})
    }
const logoutUser=async(req,res)=>{
    try{
        res.clearCookie("token")
       return  res.status(200).json({message:"User logged out successfully"})
    }catch(err){
        console.log(err)
    }
}
const getOtherUser=async(req,res)=>{
    try{
      const id=req.user.id
      const users=await UserModel.find({id:{$ne:id}}).select("-password")
      res.status(200).json(users)
    }catch(err){
        console.log(err)
    }
}

module.exports = {registerUser, loginUser,logoutUser,getOtherUser};
