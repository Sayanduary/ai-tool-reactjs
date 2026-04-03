import mongoose from "mongoose";

async function connectDatabase() {
  try {
    // 🔥 Prevent queries from hanging if DB is not connected
    mongoose.set("bufferCommands", false);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
    throw err; // 🔥 MUST throw so server doesn't start
  }
}

export default connectDatabase;
