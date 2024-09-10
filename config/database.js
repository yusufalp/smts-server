import mongoose from "mongoose";

try {
  await mongoose.connect(process.env.DB_URL);
  console.log("Connected to the database");
} catch (error) {
  console.log(`Error connecting to database: ${error}`);
}
