import express from "express";
import { generateReply } from "../controllers/aiController.js";

const router = express.Router();

router.post("/ai", generateReply);

export default router;
