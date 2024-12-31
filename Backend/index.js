const http=require("http")
const {app}=require("./app")
const {Server}=require("socket.io")
const ConnnectDataBase = require("./db")

const UserModel=require("./models/userModel")
let server=http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true
    }
})
let onlineUsers=[]
let mapSocketidtouserid=new Map()
let mapuseridtosocketid=new Map()
io.on("connection",(socket)=>{
    console.log("New user connected")
    socket.on("addUser",(userId)=>{
        console.log(`user with ${socket.id} have user id ${userId}`)
        onlineUsers.push(userId)
        mapSocketidtouserid.set(socket.id,userId)
        mapuseridtosocketid.set(userId,socket.id)
        io.emit("getUsers",onlineUsers)
    })
    socket.on("sendMessage",(data)=>{
        const {receiverId,message,userId}=data
        console.log(data)
        io.to(mapuseridtosocketid.get(receiverId)).emit("getMessage",data)
    })
    socket.on("disconnect",()=>{
        const userId=mapSocketidtouserid.get(socket.id)
        onlineUsers=onlineUsers.filter((id)=>id!==userId)
        mapSocketidtouserid.delete(socket.id)
        mapuseridtosocketid.delete(userId)
        console.log("user disconnected")
    })
})
const PORT=process.env.PORT || 3000
server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
    ConnnectDataBase()
})