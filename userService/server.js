import mongoose from "mongoose";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import { userMethods } from "./lib/grpcUserService.js";

import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
});

// Load gRPC Protobuf
const userProto = protoLoader.loadSync(process.env.PROTO_SCHEMA_PATH + "/user.proto");
const userGrpc = grpc.loadPackageDefinition(userProto).UserService;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  dbName: "users",
});

// Start gRPC Server
const grpcServer = new grpc.Server();
grpcServer.addService(userGrpc.service, userMethods);

grpcServer.bindAsync(
  "0.0.0.0:5001",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("🟢 gRPC User Service running on port 5001");
  }
);

