import express from "express";
import healthRoutes from "./routes/health.js";
import redirectRoutes from "./routes/redirect.js";
import shortenRoutes from "./routes/shorten.js";

const app = express();

app.use(express.json());

// routes
app.use("/health", healthRoutes);

// catch-all route must always be last
app.use("/", redirectRoutes);

// shorten url
app.use("/api", shortenRoutes);

export default app;
