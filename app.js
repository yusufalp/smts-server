import "dotenv/config";
import "./config/database.js";

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/users", userRoutes);

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

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
