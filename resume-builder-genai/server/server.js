import { configDotenv } from "dotenv";
import app from "./src/app.js";
import connectDatabase from "./src/config/db.js";

configDotenv();

const PORT = process.env.PORT || 3000;

// 🔥 Catch sync crashes
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

const startServer = async () => {
  try {
    // ✅ Wait for DB before starting server
    await connectDatabase();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err.message);
    process.exit(1);
  }
};

startServer();

// 🔥 Catch async crashes
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  process.exit(1);
});
