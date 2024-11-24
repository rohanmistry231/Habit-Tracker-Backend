const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet"); // Import Helmet
const path = require("path");
const multer = require("multer"); // Multer for handling file uploads
const habitRoutes = require("./routes/habitRoutes");
require("dotenv").config();
const fs = require("fs");

const app = express();

// Configure Helmet to allow Vercel live script
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'", "https://vercel.live"],
        "connect-src": ["'self'", "https://vercel.live"],
      },
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to parse JSON requests
app.use(express.json());

// Use the Render-mounted disk for file uploads
const uploadsDir = process.env.STORAGE_PATH || "/mnt/data/uploads";

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer for uploads to the specified directory
const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for file size
  },
});

// Serve static files from the Render-mounted disk
app.use("/uploads", express.static(uploadsDir));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection failed", err));

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Habit Tracker API!"); // Basic response for root path
});

// API Routes
app.use("/habits", habitRoutes);

// Image upload route
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Start the server
const PORT = process.env.PORT || 5000; // Fallback to 5000 if PORT is not defined
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));