import { Kafka } from "kafkajs";
import mongoose from "mongoose";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import dotenv from "dotenv";
import grpcProductMethods from "./lib/grpcProductService.js";
import Product from "./models/productSchema.js";
dotenv.config({
  path: "../.env",
});

// Load gRPC Protobuf
const productProto = protoLoader.loadSync(process.env.PROTO_SCHEMA_PATH +"/product.proto");
const productGrpc = grpc.loadPackageDefinition(productProto).ProductService;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  dbName: "products",
});

// Kafka Setup
const kafka = new Kafka({
  clientId: "inventory-service",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "inventory-group" });

await consumer.connect();
consumer.subscribe({ topic: "order_placed" });

consumer.run({
  eachMessage: async ({ message }) => {
    const products = JSON.parse(message.value).products;

    // const productIds = products.map((product) => product.productId);
    // const quantities = products.map((product) => product.quantity);

    console.log("Received order placed event:", products);
    console.log("Products:", products[0].productId);

    products.forEach(async (product) => {
      console.log("Products:", product.productId);
      const productData = await Product.findById(product.productId);
      if (productData) {
        productData.stock -= product.quantity;
        await productData.save();
        console.log("Product updated:", productData);
      } else {
        console.error("Product not found:", product.productId);
      }
    });
  },
});

// Start gRPC Server
const grpcServer = new grpc.Server();
grpcServer.addService(productGrpc.service, grpcProductMethods);

grpcServer.bindAsync(
  "0.0.0.0:5002",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("🟢 gRPC User Service running on port 5002");
  }
);
