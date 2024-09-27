import mongoose from "mongoose";

const connectDB = async () => {
  const dbUrl = process.env.DB_URL;

  if (!dbUrl) {
    console.error(
      "Database url is missing. Set database url in your environment variables"
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to the database");
  } catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;