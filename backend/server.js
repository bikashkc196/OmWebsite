const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();
connectDB();
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://0.0.0.0:3000",
].filter(Boolean);
// ── Core Middleware ──────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
// ── Routes ───────────────────────────────
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
// ── Health Check ─────────────────────────
app.get("/api/health", (req, res) =>
  res.json({
    status: "✅ API Running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  }),
);
// ── 404 Handler ──────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});
// ── Global Error Handler ─────────────────
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
const requestedPort = Number(process.env.PORT) || 5000;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const fallbackPort = port + 1;
      console.warn(`Port ${port} is busy. Trying ${fallbackPort}...`);
      startServer(fallbackPort);
    } else {
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  });
};

// Only bind a real port for local/traditional hosting. On Vercel, @vercel/node
// invokes the exported app directly per-request — listening here is unnecessary
// and would just re-run the port-fallback dance on every cold start.
if (!process.env.VERCEL) {
  startServer(requestedPort);
}
module.exports = app;
