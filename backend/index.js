import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config({ path: "backend/.env" });
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
