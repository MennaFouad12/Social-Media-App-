import mongoose, { Schema, Types, model } from "mongoose";


const MessageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true }
}, { timestamps: true });

export const MessageModel = mongoose.model("Message", MessageSchema);
