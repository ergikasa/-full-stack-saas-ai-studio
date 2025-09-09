import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { auth } from "./middlewares/auth.js";
import aiRouter from "./routes/aiRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";

const app = express();

// connect Cloudinary
await connectCloudinary();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Clerk middleware first
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("Server is live"));

// All protected API routes
app.use(requireAuth());
app.use(auth);
app.use("/api/ai", aiRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
