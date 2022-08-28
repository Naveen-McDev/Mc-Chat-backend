import express from "express";
import { verifyToken } from "../config/verifyToken.js";
import { login, signup, getAllUsers } from "../controller/user.js";
const router = express.Router();

//CREATE A USER
router.post("/signup", signup)

//SIGN IN
router.post("/login", login)

router.get("/getallusers", verifyToken, getAllUsers)

export default router;