import express from "express";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());

/* Requires all the routes here */

import authRouter from "./routes/auth.routes.js";

/* Using all the routes here */

app.use("/api/auth", authRouter);

export default app;
