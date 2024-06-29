import { sendMesage } from "../controllers/messages.controllers.js";
import express from "express";
import checkAuth from "../middleware/checkAuth.js";


const router=express.Router();

router.post("/sendmsg/:id",checkAuth,sendMesage);



export default router;
