import express from "express";
import { redirectHandler } from "../controllers/redirect.controller.js";

const router = express.Router();

// GET /:shortCode
router.get("/:shortCode", redirectHandler);

export default router;
