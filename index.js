import express from "express";
import bootstarp from "./src/app.controller.js";
import dotenv from "dotenv";
import { createPost } from "./src/Modules/Post/post.service.js";


const app = express();
dotenv.config({ path: './src/config/.env' });
const port = process.env.PORT || 8000;

await bootstarp(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));