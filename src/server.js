const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const mainroutes = require("./routes/Routes");

const app = express();

const PORT = process.env.PORT || 5000;

// Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Madhav IT Services Backend is running",
  });
});

// Routes
app.use(mainroutes);

// Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});