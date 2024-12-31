const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
  },
  dataType:{
    type:String,
    default:"text",
    enum:["text","image","video"]
  }
});

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;
