
import { defaultImage, UserModel } from "../../DB/Models/user.model.js";
import * as dbService from "../../DB/dbService.js";
import { emailEmitter } from "../../utils/email/email.event.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
import path from "path";
import fs from "fs";
import cloudinary from "../../utils/file uploading/cloudinaryConfig.js";
export const getProfile = async (req, res, next) => {
  const user = await dbService.findOne({
    model: UserModel,
    filter: { _id: req.user._id, isDeleted: false },
    populate: [{ path: "viewers.userId", select: "userName email image" }],

  })

  return res.status(200).json({
    success: true,
    message: "User Profile",
    user,
  });

};
export const shareProfile = async (req, res, next) => {
  const { profileId } = req.params;
  let user = undefined;
  if (profileId == req.user._id.toString()) {
    user = req.user;
  }
  else {
    user = await dbService.findOneAndUpdate({
      model: UserModel,
      filter: { _id: profileId, isDeleted: false },
      data: {
        $push: {
          viewers: {
            userId: req.user._id,
            time: Date.now()
          }
        }
      }, select: "userName email image"
    });
  }
  return user ? res.status(200).json({ success: true, data: { user } })
    : next(new Error("User Not Found", { cause: 404 }));

};
//to change email
//email otp to old email, new email otp
export const updateEmail = async (req, res, next) => {
  const { email } = req.body;
  if (await dbService.findOne({ model: UserModel, filter: { email } }))
    return next(new Error("Email Exist", { cause: 409 }));
  await dbService.updateOne({ model: UserModel, filter: { _id: req.user._id }, data: { tempEmail: email } });


  emailEmitter.emit("sendEmail", req.user.email, req.user.userName, req.user._id);
  emailEmitter.emit("updateEmail", email, req.user.userName, req.user._id);

  return res.status(200).json({
    success: true,
    message: "User Profile",
  })
};

export const resetEmail = async (req, res, next) => {
  const { oldCode, newCode } = req.body;
  if (!compareHash({ plainText: oldCode, hash: req.user.confirmEmailOTP }) || !compareHash({ plainText: newCode, hash: req.user.tempEmailOTP }))
    return next(new Error("In-valid Code", { cause: 400 }));

  const user = await dbService.updateOne({
    model: UserModel,
    filter: { _id: req.user._id },
    data: {
      email: req.user.tempEmail,
      changedCredentialsTime: Date.now(),
      $unset: { tempEmail: "", tempEmailOTP: "", confirmEmailOTP: "" },
    },
  });
  return res.status(200).json({ success: true, data: { user } });

};


export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!compareHash({ plainText: oldPassword, hash: req.user.password }))
    return next(new Error("In-valid Password", { cause: 400 }));
  const hashPassword = hash({ plainText: newPassword });
  const user = await dbService.updateOne({
    model: UserModel,
    filter: { _id: req.user._id },
    data: {
      password: hashPassword,
      changedCredentialsTime: Date.now(),
    },
  });


  return res.status(200).json({ success: true, message: "Password Updated Successfully" });

};

export const updateProfile = async (req, res, next) => {
  const { userName, address, gender, phone, DOB } = req.body;
  const user = await dbService.findOneAndUpdate({
    model: UserModel,
    filter: { _id: req.user._id },
    data: req.body,
    options: { new: true, runValidator: true }
  })
  return res.status(200).json({ success: true, data: { user } });

};

export const uploadImageDisk = async (req, res, next) => {
  const user = await dbService.findByIdAndUpdate({
    model: UserModel,
    id: req.user._id,
    data: { image: req.file.path },
    options: { new: true }
  })
  return res.status(200).json({ success: true, data: { user } });
}

export const uploadMultipleImages = async (req, res, next) => {
  console.log({ data: req.files });
  const user = await dbService.findByIdAndUpdate({
    model: UserModel,
    id: req.user._id,
    data: { coverImages: req.files.map((obj) => obj.path) },
    options: { new: true }
  })
  return res.status(200).json({ success: true, data: { user } });
}

export const deleteProfileImages = async (req, res, next) => {
  const user = await dbService.findById({
    model: UserModel,
    id: req.user._id,

  })
  const imagePath = path.resolve(".", user.image);
  fs.unlinkSync(imagePath);
  user.image = defaultImage;
  await user.save();
  return res.status(200).json({ success: true, data: { user } });
}

export const uploadOnCloud = async (req, res, next) => {
const user=await dbService.findById({model:UserModel,id:req.user._id})
const results = await cloudinary.uploader.upload(req.file.path,{folder:`Users/${req.user._id}/profilePicture`});
const { public_id, secure_url } = results;
user.image={public_id,secure_url}
await user.save();
return res.status(200).json({ success: true, data: { user } });

}