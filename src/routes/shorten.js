import express from "express";
import { shortUrlHandler } from "../controllers/shorten.controller.js";
import { getStats } from "../controllers/stats.controller.js";

const router = express.Router();


router.post("/shorten", shortUrlHandler);
router.get("/stats/:shortCode", getStats);


export default router;
