import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { logToKafka, initProducer, kafkaLogConsumer } from "./lib/kafka.js";
import setupWebSocketServer from "./lib/websocket.js";
import setupRoutes from "./routes/logRoutes.js";

// Load environment variables
dotenv.config({ path: "../.env" });

// Initialize Express app
const app = express();
const PORT = 5004;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { dbName: "Log" });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Kafka producer
await initProducer().catch((error) => {
  console.error("Error initializing Kafka producer:", error);
});

// Start Kafka consumer
kafkaLogConsumer();

// Setup WebSocket server
const wss = setupWebSocketServer(8080);

// Setup routes
setupRoutes(app, wss);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
