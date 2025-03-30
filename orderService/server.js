import { grpcOrderMethods } from "./lib/grpcOrderMethods.js";
import mongoose from "mongoose";
import { Kafka } from "kafkajs";
import dotenv from "dotenv";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

dotenv.config({
  path: "../.env",
});

// Load gRPC Protobuf
const orderProto = protoLoader.loadSync("./protos/order.proto");
const orderGrpc = grpc.loadPackageDefinition(orderProto).OrderService;

mongoose.connect(process.env.MONGO_URI, {
  dbName: "orders",
});

// Start gRPC Server
const grpcServer = new grpc.Server();
grpcServer.addService(orderGrpc.service, grpcOrderMethods);

grpcServer.bindAsync(
  "0.0.0.0:5003",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("🟢 gRPC User Service running on port 5003");
  }
);
