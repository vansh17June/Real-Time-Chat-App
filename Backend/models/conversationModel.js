const mongoose=require("mongoose")
const conversationSchema=new mongoose.Schema({
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }],
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message",
       
    }]
})
const ConversationModel=mongoose.model("Conversation",conversationSchema)
module.exports=ConversationModel