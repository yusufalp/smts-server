import "dotenv/config";
import "./config/database.js";

import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import userRoutes from "./routes/userRoutes.js";
import meetingRoutes from "./routes/meetingRoutes.js";

const app = express();

app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", userRoutes);
app.use("/api/meetings", meetingRoutes)

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
