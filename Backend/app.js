const express=require("express")
const dotenv=require("dotenv")
const multer=require("multer")
const path=require("path")
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public")
    },
    filename:function(req,file,cb){
        const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
        cb(null,uniqueName)
    }
})
const upload=multer({storage:storage})



const cookieParser=require("cookie-parser")
const userRoutes=require("./route/userRoute")
const messageRoutes=require("./route/messageRoutes")
const cors=require("cors")
dotenv.config()
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/user",userRoutes)
app.use("/api/message",messageRoutes)
module.exports={app,upload}