import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import mongoose from 'mongoose';

export const sendMesage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Ensure senderId and receiverId are ObjectIds
    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    let conversation = await Conversation.findOne({
      participants: { $all: [senderObjectId, receiverObjectId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderObjectId, receiverObjectId],
      });
    }

    const newMessage = new Message({
      senderId: senderObjectId,
      receiverId: receiverObjectId,
      message,
    });

    //await newMessage.save();

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      ///await conversation.save();
    }
await Promise.all([conversation.save(),newMessage.save()]);
    res.status(201).json(newMessage);

  } catch (error) {
    console.log("Error in msg controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
