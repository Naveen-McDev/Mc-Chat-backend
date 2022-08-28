import express from "express";
import { verifyToken } from "../config/verifyToken.js";
import { accessChat, addToGroup, createGroup, fetchChats, removeFromGroup, renameGroup } from "../controller/chat.js";

const router = express.Router();

router.post("/", verifyToken, accessChat);
router.get("/", verifyToken, fetchChats);
router.post("/group/create", verifyToken, createGroup);
router.put("/group/rename", verifyToken, renameGroup);
// router.delete("/group/delete", verifyToken, deleteGroup);
router.put("/group/user/add", verifyToken, addToGroup);
router.put("/group/user/remove", verifyToken, removeFromGroup);

export default router;
