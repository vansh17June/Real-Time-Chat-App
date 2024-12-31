const ConversationModel=require("../models/conversationModel")
const MessageModel=require("../models/messageModal")

const SendMessage=async(req,res)=>{
    try{
      const sender_id=req.user.id
      const receiver_id=req.params.id
      const message=req.body.message
      const dataType=req.body.dataType||"text"
      const conversation=await ConversationModel.findOne({
        members:{$all:[sender_id,receiver_id]}
      })
      if(conversation){
        const Newmessage=await MessageModel.create({
          sender_id,
          receiver_id,
          message,
          dataType
        })
        conversation.messages.push(Newmessage.id)
        await conversation.save()
        res.status(200).json({message:"Message sent successfully"})
    }else{
        const newConversation=await ConversationModel.create({
            members:[sender_id,receiver_id]
        })
        const Newmessage=await MessageModel.create({
          sender_id,
          receiver_id,
          message,
          dataType
        })
        newConversation.messages.push(Newmessage.id)
        await newConversation.save()
        res.status(200).json({message:"Message sent successfully"
        })
    }
    }
    catch(err){
        console.log(err)
    }
}

const getMessages=async(req,res)=>{
    try{
       const sender_id=req.user.id
       const receiver_id=req.params.id
       const conversation=await ConversationModel.findOne({
        members:{$all:[sender_id,receiver_id]}
       })
       const messages=await MessageModel.find({
        _id:{$in:conversation.messages}
       }).sort({createdAt:-1})
       res.status(200).json({messages
       })
    }catch(err){
        console.log(err)
    }
}
module.exports={SendMessage,getMessages}