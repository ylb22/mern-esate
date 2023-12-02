import express from "express";
import { signUp, signin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.get("/signin", signin);

export default router;
