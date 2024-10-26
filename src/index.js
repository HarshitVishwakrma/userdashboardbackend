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


app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*'); // Replace '*' with frontend URL for production
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.set('Access-Control-Allow-Credentials', 'true'); // Optional if using cookies
  next();
});

app.use(
  cors({
    origin: "https://userdashboard-theta.vercel.app", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // Allow cookies and credentials
    allowedHeaders: ["Content-Type", "Authorization"], // Allow required headers
  })
);


// Handle Preflight Requests (OPTIONS)
app.options('*', (req, res) => {
  res.status(204).send(); // Respond with No Content
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
