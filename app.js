import "dotenv/config";

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import connectDB from "./config/database.js";

import adminRoutes from "./routes/adminRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

import { authenticateToken } from "./middlewares/authenticateToken.js";

const app = express();

connectDB();

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authenticateToken);

app.use("/api/admin", adminRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/profiles", profileRoutes);

app.get("/", (req, res, next) => {
  res.send("We are just getting started...");
});

app.use((err, req, res, next) => {
  console.error("An error occurred:", err);

  if (err.code === 11000) {
    return res.status(400).json({
      error: { message: "There was a problem when signing up." },
    });
  }

  return res.status(err.code || 500).json({
    error: { message: err.message || "Internal server error." },
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`
    Server is listening on port ${PORT}. 
    http://localhost:${PORT}
    `);
});
