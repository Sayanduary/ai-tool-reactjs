import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

/* Middlewares */
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

/* CORS */
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        /^https:\/\/([a-z0-9-]+\.)*tunnel\.stylnode\.in$/i.test(origin)
      ) {
        return callback(null, true);
      }

      console.error("❌ CORS Blocked:", origin);
      return callback(null, false); // ⚠️ do NOT throw error
    },
    credentials: true,
  }),
);

/* Health check */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/* Routes */
import authRouter from "./routes/auth.routes.js";
app.use("/api/auth", authRouter);

/* GLOBAL ERROR HANDLER (VERY IMPORTANT) */
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
