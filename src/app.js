import express from "express";
import healthRoutes from "./routes/health.js";
import redirectRoutes from "./routes/redirect.js";

const app = express();

app.use(express.json());

// routes
app.use("/health", healthRoutes);

// catch-all route must always be last
app.use("/", redirectRoutes);

export default app;
