
import dns from "node:dns";
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import agentRouter from "./routes/agent.routes.js";
import agentChatRouter from "./routes/agentChat.routes.js";
import chatRouter from "./routes/chat.routes.js";
import integrationRouter from "./routes/integration.route.js";
import paymentRouter from "./routes/payment.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      try {
        const hostname = new URL(origin).hostname;
        if (
          allowedOrigins.includes(origin) ||
          hostname.endsWith(".vercel.app") ||
          hostname.endsWith(".onrender.com")
        ) {
          return callback(null, true);
        }
      } catch (e) {}
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/test-db", async (req, res) => {
  try {
    await connectDB();
    return res.json({ success: true, message: "MongoDB connected successfully!" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      errorName: err.name,
      errorCode: err.code,
      errorMessage: err.message,
    });
  }
});

app.use("/api/auth",authRouter)
app.use("/api/agents", agentRouter);
app.use("/api/agent-chat", agentChatRouter);
app.use("/api/chat", chatRouter);
app.use("/api/integrations", integrationRouter);
app.use("/api/payment", paymentRouter);


app.listen(PORT, () => {
  console.log(`AutoMate AI API running at ${PORT}`);

  connectDB().catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    if (error.code === 8000 || error.message?.includes("bad auth")) {
      console.error("-> Reason: Bad credentials! The username or password in MONGODB_URI is incorrect.");
    } else if (error.name === "MongoServerSelectionError" || error.message?.includes("timed out")) {
      console.error("-> Reason: Network timeout! Atlas IP whitelist (0.0.0.0/0) may still be deploying or DNS failed.");
    }
  });
});