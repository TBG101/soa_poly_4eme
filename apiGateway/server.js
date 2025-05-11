import express from "express";
import dotenv from "dotenv";
import setupApolloServer from "./lib/apollo/apolloServer.js";
import authMiddleware from "./lib/middleware/authMiddleware.js";
import { userClient, productClient, orderClient } from "./lib/grpc/grpcClients.js";
import { routes } from "./lib/rest/routes.js";
import rateLimit from "express-rate-limit";
import cors from "cors";

dotenv.config({
  path: "../.env",
});
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

// Apply rate limiter to all requests
app.use(limiter);

// Apply middleware
app.use(authMiddleware);

// Set up REST API routes
routes(app, userClient, productClient, orderClient);

async function startServer() {
  const server = await setupApolloServer(userClient, productClient, orderClient);
  await server.start();
  server.applyMiddleware({ app });

  // Start API Gateway
  app.listen(5000, () => {
    console.log(`API Gateway running on port 5000`);
  });
}

startServer();
