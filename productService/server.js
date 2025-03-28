import express from "express";
import mongoose from "mongoose";
import Product from "./models/productSchema.js";
import { Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  dbName: "products",
});

// Kafka Setup
const kafka = new Kafka({
  clientId: "inventory-service",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "inventory-group" });

consumer.connect();
consumer.subscribe({ topic: "order_placed" });

consumer.run({
  eachMessage: async ({ message }) => {
    const { productId, quantity } = JSON.parse(message.value.toString());
    const product = await Product.findById(productId);
    if (product) {
      product.stock -= quantity;
      await product.save();
      console.log(`Stock updated for product: ${productId}`);
    }
  },
});

// Routes
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.listen(5002, () => console.log("Product service running on port 5002"));
