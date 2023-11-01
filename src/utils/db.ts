import mongoose from "mongoose";

export const connectDB = async (uri: string) => {
  if (!uri) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env"
    );
  }
  try {
    const conn = await mongoose.connect(uri, {
      dbName: "reddit-blog-generator",
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
