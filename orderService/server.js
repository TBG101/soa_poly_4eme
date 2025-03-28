import express from "express";
import mongoose from "mongoose";
import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  dbName: "orders",
});

// Kafka Setup
const kafka = new Kafka({
  clientId: "order-service",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();
producer.connect();

// Create Order
app.post("/order", async (req, res) => {
  const { productId, quantity } = req.body;
  const order = new Order({ productId, quantity, status: "pending" });
  await order.save();

  // Emit Kafka Event
  await producer.send({
    topic: "order_placed",
    messages: [{ value: JSON.stringify({ productId, quantity }) }],
  });

  res.json({ message: "Order placed" });
});

app.listen(5003, () => console.log("Order service running on port 5003"));
