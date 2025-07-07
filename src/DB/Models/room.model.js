import mongoose, { Schema, Types, model } from "mongoose";


const RoomSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

export const RoomModel = mongoose.model("Room", RoomSchema);
export const addUserToRoom = async (roomId, userId) => {
  try {
    const objectIdUser = new mongoose.Types.ObjectId(userId); // Convert userId
    await RoomModel.findByIdAndUpdate(roomId, {
      $addToSet: { users: objectIdUser }, // Use converted ObjectId
    });
  } catch (error) {
    console.error("Error adding user to room:", error);
  }
};

export const removeUserFromRoom = async (roomId, userId) => {
  try {
    await RoomModel.findByIdAndUpdate(roomId, {
      $pull: { users: userId },
    });
  } catch (error) {
    console.error("Error removing user from room:", error);
  }
};
