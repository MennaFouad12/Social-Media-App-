import mongoose, { Schema, model } from "mongoose";

export const genderType = {
  male: "male",
  female: "female",
};
export const roleType = {
  User: "User",
  Admin: "Admin",
};
export const providersType = {
  System: "System",
  Google: "Google",
};
export const defaultImage="upload\default-avatar-icon-of-social-media-user-vector.jpg"
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      minLength: [3, "userName must be at least 3 characters"],
      maxLength: [30, "userName must be at most 20 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    providers: {
      type: String,
      enum: Object.values(providersType),
      default: providersType.System,
    },
    phone: String,
    address: String,
    DOB: Date,
    // image: {
    //   type: String,
    //   default: defaultImage,
    // },
    image:{
secure_url: String,
public_id: String
    },
    coverImages: [String],
    gender: {
      type: String,
      enum: Object.values(genderType),
      default: genderType.male,
    },
    role: {
      type: String,
      enum: Object.values(roleType),
      default: roleType.User,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    changedCredentialsTime: Date,
    confirmEmailOTP: String,
    forgetPasswordOTP: String,
    viewers:[{
      userId:{type:Schema.Types.ObjectId,ref:"User"},
      time:Date,
    }],
    tempEmail:String,
    tempEmailOTP:String,
  },
  { timestamps: true }
);

export const UserModel = mongoose.model.User || model("User", userSchema);
