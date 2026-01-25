import express from "express";
import { shortUrlHandler } from "../controllers/shorten.controller.js";

const router = express.Router();

router.post("/shorten", shortUrlHandler);

export default router;
