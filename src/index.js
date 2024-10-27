import express from "express";
import { connectDb } from "./config/dbConenction.js";
import cors from "cors"
// *********** All-Routes *************
import auth from "./routes/auth.routes.js";
import user from "./routes/user.routes.js";
import dotenv from "dotenv";
dotenv.config();
// *********** All-Routes *************

import cookieParser from "cookie-parser";
const app = express();
// Use cors middleware


const allowedOrigin = 'https://userdashboard-theta.vercel.app/';

// Middleware to set CORS headers manually
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');  // If credentials (cookies, tokens) are needed
  next();
});

// Handle preflight requests (OPTIONS)
app.options('*', (req, res) => {
  res.sendStatus(204);  // No Content
});



//middle wares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// *********** All-Routes *************

app.get("/", (req, res) => {
  res.json("I'm coming from backend");
});
app.use("/api/auth/v1", auth);
app.use("/api/user/v1", user);

// for wrong apis
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found. Please check the URL and try again.",
  });
});

// Error handling middleware (optional, for other server errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error.",
    error: err.message,
  });
});

app.listen(7000, async () => {
  console.log("Server is running on port 7000");
  await connectDb();
});
