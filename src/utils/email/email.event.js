import { EventEmitter } from "events";
import { customAlphabet } from "nanoid";
import { hash } from "../../utils/hashing/hash.js";
import { UserModel } from "../../DB/Models/user.model.js";
import { template } from "./generateHTML.js";
import sendEmails, { subject } from "./sendEmail.js";
import { updateEmail } from "../../Modules/User/user.service.js";
import * as dbService from "../../DB/dbService.js";
export const emailEmitter = new EventEmitter();

emailEmitter.on("sendEmail", async (email, userName,id) => {
  await sentCode({
    data:{email,userName,id},
    subjectType:subject.register
    
  })
});


emailEmitter.on("forgotPassword", async (email, userName,id) => {
  await sentCode({
    data:{email,userName,id},
    subjectType:subject.resetPassword

  })
});
emailEmitter.on("updateEmail", async (email, userName,id) => {
  await sentCode({
    data:{email,userName,id},
    subjectType:subject.updateEmail
  })
});
export const sentCode=async({
  data={},
  subjectType=subject.register,
})=>{
  const { email, userName,id } = data;
  const opt = customAlphabet("0123456789", 6)();
  const hashOTP = hash({ plainText: opt });
  let updateData={};
  switch(subjectType){
    case subject.register:
      updateData={confirmEmailOTP:hashOTP};
      break;
      case subject.resetPassword:
      updateData={forgetPasswordOTP:hashOTP};
      break;
    case subject.updateEmail:
      updateData={tempEmailOTP:hashOTP};
      break;
    default:
      break;
  }

  await dbService.updateOne({model:UserModel,filter:{_id:id},data:updateData});

  const isSent = await sendEmails({
    to: email,
    subject: subject.subjectType,
    html: template(opt, userName,subject.subjectType),
  });

}

