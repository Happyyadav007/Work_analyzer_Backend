import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./database/db.js"; // renamed for clarity
import cookieParser from "cookie-parser";

// Routes
import employerRoutes from "./routes/employers.js";
import itemRoutes from "./routes/item.js";
// Middleware
import notFoundMiddleware from "./middleware/notFound.js";
import errorHandlerMiddleware from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// Configure CORS to allow credentials and specific origin
app.use(
  cors({
    origin: "http://localhost:5175",
    credentials: true, 
  })
);

// app.use(cors());

app.use(morgan("tiny"));
app.disable("x-powered-by");

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Interior Design Work Analyzer API!");
});

// API routes
app.use("/api/employers", employerRoutes);
app.use("/api/items", itemRoutes);
// Error handling middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Start server after DB connects
const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB successfully");

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
};

// Start app
startServer();

// Handle unexpected errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
