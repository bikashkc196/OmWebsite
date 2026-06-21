require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

const app = express();
connectDB();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

//Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));

// Health Check
app.get("/api/health", (req, res) => res.json({ status: "✅ API Running" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.statusCode || 500)
    .json({ message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
