import { create } from "../../DB/dbService.js";
import { providersType, roleType, UserModel } from "../../DB/Models/user.model.js";
import { emailEmitter } from "../../utils/email/email.event.js";
import { compareHash, hash } from "../../utils/hashing/hash.js";
import { generateToken, verifyToken } from "../../utils/token/token.js";
import {OAuth2Client} from 'google-auth-library';
import * as dbService from "../../DB/dbService.js";
import dotenv from "dotenv";
import { decodedToken } from "../../middleware/auth.middleware.js";
dotenv.config({ path: '../../config/.env' });
export const register = async (req, res, next) => {
  const { userName, email, password } = req.body;

  if (await dbService.findOne({model:UserModel,filter:{email}}))
    return next(new Error("Email Exist", { cause: 409 }));

  const hashPassword = hash({ plainText: password });
const user=await dbService.create({model:UserModel,data:{userName,email,password:hashPassword}});
  
  emailEmitter.emit("sendEmail", email, userName);

  return res.status(201).json({
    success: true,
    message: "User Created Successfully",
    user,
  });
};

export const cofirmEmail = async (req, res, next) => {
  const { email, code } = req.body;

  const user = await dbService.findOne({model:UserModel,filter:{email}});

  if (!user) return next(new Error("In-valid User", { cause: 404 }));

  if (user.confirmEmail == true)
    return next(new Error("Already Verified", { cause: 409 }));

  if (!compareHash({ plainText: code, hash: user.confirmEmailOTP }))
    return next(new Error("In-valid Code", { cause: 400 }));

  await dbService.updateOne({model:UserModel,filter:{email},data:{confirmEmail:true,$unset:{confirmEmailOTP:""}}});

  return res.status(200).json({
    success: true,
    message: "Email Verified Successfully",
  });
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await dbService.findOne({model:UserModel,filter:{email}});

  if (!user) return next(new Error("In-valid User", { cause: 404 }));
  if (user.confirmEmail == false)
    return next(new Error("Email Not Verified", { cause: 400 }));

  if (!compareHash({ plainText: password, hash: user.password }))
return next(new Error("In-valid Password", { cause: 400 }));
  const access_token = generateToken({payload:{id:user._id},
  signature:user.role===roleType.User?
  process.env.USER_ACCESS_TOKEN:
  process.env.ADMIN_ACCESS_TOKEN,
  options: {expiresIn:process.env.ACCESS_TOKEN_EXPIRE}
});
  const refresh_token = generateToken({payload:{id:user._id},
    signature:user.role===roleType.User?
    process.env.USER_REFRESH_TOKEN:
    process.env.ADMIN_REFRESH_TOKEN,
    options: {expiresIn:process.env.REFRESH_TOKEN_EXPIRE}
  });
  return res.status(200).json({
    success: true,
    message: "Login Successfully",
    tokens: { access_token, refresh_token },
  });
};


 
export const refresh_token = async (req, res, next) => {
  const {autherization} = req.headers;
  const user = await decodedToken(autherization,tokenTypes.refresh,next);
const access_token = generateToken({payload:{id:user._id},
  signature:user.role===roleType.User?
  process.env.USER_ACCESS_TOKEN:
  process.env.ADMIN_ACCESS_TOKEN});
  const refresh_token = generateToken({payload:{id:user._id},
    signature:user.role===roleType.User?
    process.env.USER_REFRESH_TOKEN:
    process.env.ADMIN_REFRESH_TOKEN});

  
  return res.status(200).json({
    success: true,
  
    tokens: { access_token, refresh_token },
  });  
};
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const user = await dbService.findOne({model:UserModel,filter:{email,isDeleted:false}});

  if (!user) return next(new Error("In-valid User", { cause: 404 }));

emailEmitter.emit("forgotPassword", email, user.userName);
  
  return res.status(200).json({
    success: true,
  
  message: "Email Sent Successfully",
  });  
};

export const resetPassword = async (req, res, next) => {
  const { email,code,password } = req.body;

  const user = await dbService.findOne({model:UserModel,filter:{email,isDeleted:false}});


  if (!user) return next(new Error("In-valid User", { cause: 404 }));

  if (!compareHash({ plainText: code, hash: user.forgetPasswordOTP }))
    return next(new Error("In-valid Code", { cause: 400 }));
  const hashPassword = hash({ plainText: password }); 
  await dbService.updateOne({model:UserModel,filter:{email},data:{password:hashPassword,$unset:{forgetPasswordOTP:""}}});
  // await UserModel.updateOne(
  //   { email },
  //   { password: hashPassword, $unset: { forgetPasswordOTP: "" } }
  // )
  
  return res.status(200).json({
    success: true,
  
  message: "password reset Successfully",
  });  
};
export const loginWithGmail = async (req, res, next) => {
  const { idToken } = req.body;

  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }
  const { email_verified, email, name, picture } = await verify();

  if (!email_verified)
    return next(new Error("Email Not Verified", { cause: 400 }));

  let user = await dbService.findOne({ model: UserModel, filter: { email } });

  if (user?.providers === providersType.System)
    return next(new Error("In-valid Login Method", { cause: 409 }));

  if (!user) {
    user = await dbService.create({
      model: UserModel,
      data: {
        confirmEmail: email_verified,
        userName: name,
        email,
        image: picture,
        providers: providersType.Google,
      },
    });
  }

  const access_token = generateToken({
    payload: { id: user._id },
    signature: process.env.USER_ACCESS_TOKEN,
    options: { expiresIn: String(process.env.ACCESS_TOKEN_EXPIRE) },
  });
  
  const referesh_token = generateToken({
    payload: { id: user._id },
    signature: process.env.USER_REFRESH_TOKEN,
    options: { expiresIn: String(process.env.REFRESH_TOKEN_EXPIRE) },
  });
  

  return res.status(200).json({
    success: true,
    results: {
      access_token,
      referesh_token,
    },
  });
};
