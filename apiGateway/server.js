import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import dotenv from "dotenv";
import { createResolvers } from "./lib/graphQL/gplResolvers.js";
import { getSchema } from "./lib/graphQL/schemaBuilder.js";
import { addResolversToSchema } from "@graphql-tools/schema";
import jwt from "jsonwebtoken";
dotenv.config({
  path: "../.env",
});

const app = express();

// Load gRPC Protobuf Definitions
const userProto = protoLoader.loadSync("./protos/user.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const productProto = protoLoader.loadSync("./protos/product.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const orderProto = protoLoader.loadSync("./protos/order.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Load gRPC Clients
const UserService = grpc.loadPackageDefinition(userProto).UserService;
const ProductService = grpc.loadPackageDefinition(productProto).ProductService;
const OrderService = grpc.loadPackageDefinition(orderProto).OrderService;

// Create gRPC Clients
const userClient = new UserService(
  "localhost:5001",
  grpc.credentials.createInsecure()
);

const productClient = new ProductService(
  "localhost:5002",
  grpc.credentials.createInsecure()
);

const orderClient = new OrderService(
  "localhost:5003",
  grpc.credentials.createInsecure()
);
// Load GraphQL Schema and Resolvers
const schema = await getSchema();
const resolvers = createResolvers(userClient, productClient, orderClient);

// Set up Apollo Server
const server = new ApolloServer({
  schema: addResolversToSchema({
    schema,
    resolvers,
  }),
  context: async ({ req }) => {
    if (!req.headers.authorization) {
      return { user: null };
    }
    const token = req.headers.authorization.replace("Bearer ", "");
    const user = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Token verification error: ", err);
        return { user: null };
      }
      return { user: decoded };
    });

    return user;
  },
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  // Start API Gateway
  app.listen(5000, () => {
    console.log(`API Gateway running on port 5000`);
  });
}

startServer();
