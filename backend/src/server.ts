import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes/api";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    system: "QuestMe Core Engine",
    timestamp: new Date().toISOString()
  });
});

// Mount main API
app.use("/api", apiRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message || "Internal server error"
  });
});

// Start listening if run directly
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`⚔️ QuestMe Server listening on http://localhost:${PORT}`);
  });
}

export default app;
