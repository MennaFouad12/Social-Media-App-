import authRouter from "./Modules/Auth/auth.controller.js";
import userRouter from "./Modules/User/user.controller.js";
import postRouter from "./Modules/Post/post.controller.js";
import commentRouter from "./Modules/Comment/comment.controller.js";
import connectDB from "./DB/connection.js";
import {
  globalErrorHandler,
  notFoundHabdler,
} from "./utils/error handling/asyncHandler.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { fileValidation, uploadCloud } from "./utils/file uploading/multerUpload.js";
import { createPost } from "./Modules/Post/post.service.js";

import morgan from "morgan";


const bootstarp = async (app, express) => {
  await connectDB();
  app.use(morgan("combined"));
//   const whiteList = [
//     "http://localhost:4200",
//     "http://localhost:5200",
    
//   ]
//   app.use((req, res, next) => {
//     if (!whiteList.includes(req.headers.origin)) {
// return next(new Error("Blocked by cors", { cause: 401 }));
//     }
//     res.headers("Access-Control-Allow-Origin", req.headers("origin"));
//     req.headers("Access-Control-Allow-Method", "*");
//     req.headers("Access-Control-Allow-Headers", "*");
//     req.headers("Access-Control-Allow-Headers", true);
//     return next();
//   })
  app.use("/uploads", express.static("uploads"));
  app.use(cors());

  app.use(express.json()); // pasing body

  app.get("/", (req, res) => res.json("Hello World!"));
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/post", postRouter);
  app.use("/comment", postRouter);

  app.all("*", notFoundHabdler);

  app.use(globalErrorHandler);
};

export default bootstarp;
