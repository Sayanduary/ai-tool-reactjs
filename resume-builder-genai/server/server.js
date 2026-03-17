import { configDotenv } from "dotenv";
import app from "./src/app.js";
import connectDatabase from "./src/config/db.js";

configDotenv();

connectDatabase();

app.listen(3000, () => {
  console.log("Server Stared");
});
