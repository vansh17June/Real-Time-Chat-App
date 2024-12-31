const express=require("express")
const isAuthenticate = require("../middleware/isAuthenticate")
const { SendMessage, getMessages } = require("../controller/messageController")
const router=express.Router()
router.post("/sendMessage/:id",isAuthenticate,SendMessage)
router.get("/getMessages/:id",isAuthenticate,getMessages)
module.exports=router