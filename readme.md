# E-Commerce Microservices Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0-green.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-required-blue.svg)](https://www.docker.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-API-pink.svg)](https://graphql.org/)
[![gRPC](https://img.shields.io/badge/gRPC-protocol-blue.svg)](https://grpc.io/)
[![Kafka](https://img.shields.io/badge/Kafka-messaging-black.svg)](https://kafka.apache.org/)

## 📖 Table of Contents

- [E-Commerce Microservices Platform](#e-commerce-microservices-platform)
  - [📖 Table of Contents](#-table-of-contents)
  - [🚀 Project Overview](#-project-overview)
  - [🏗️ Architecture](#️-architecture)
    - [Microservices](#microservices)
    - [Communication Patterns](#communication-patterns)
    - [C4 Model Diagrams](#c4-model-diagrams)
      - [System Context](#system-context)
      - [Container View](#container-view)
  - [🛠️ Tech Stack](#️-tech-stack)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [DevOps](#devops)
  - [✨ Features](#-features)
  - [📦 Installation](#-installation)
    - [Prerequisites](#prerequisites)
    - [Setup Instructions](#setup-instructions)
  - [🖥️ Usage](#️-usage)
    - [Main User Flows:](#main-user-flows)
  - [📚 API Documentation](#-api-documentation)
    - [GraphQL API](#graphql-api)
    - [REST API](#rest-api)
      - [User Endpoints](#user-endpoints)
      - [Product Endpoints](#product-endpoints)
      - [Order Endpoints](#order-endpoints)
      - [Log Endpoints](#log-endpoints)
    - [WebSocket API](#websocket-api)
    - [gRPC Services](#grpc-services)
  - [🧑‍💻 Development](#-development)
    - [Real-time Communication](#real-time-communication)
  - [📄 License](#-license)

## 🚀 Project Overview

This advanced e-commerce platform demonstrates modern software architecture principles through a distributed microservices approach. Built as a university project at **Polytechnique Sousse**, it showcases real-world patterns for building scalable, resilient, and maintainable e-commerce systems.

The platform enables users to browse products, manage their shopping carts, place orders, and receive real-time notifications through a React-based frontend that interacts with the backend microservices via GraphQL API.

## 🏗️ Architecture

This project implements a modern microservices architecture with the following key components:

### Microservices

- **API Gateway**: The single entry point for all client requests, implementing GraphQL for flexible data querying and aggregation
- **User Service**: Manages user authentication, profiles, and security
- **Product Service**: Handles product catalog and inventory management
- **Order Service**: Processes order creation, payment processing, and fulfillment
- **Logging Service**: Provides real-time system monitoring and logging
- **Frontend Application**: React-based UI built with TypeScript and Vite

### Communication Patterns

- **Synchronous**: gRPC for efficient, type-safe inter-service communication
- **Asynchronous**: Kafka for event-driven operations and service decoupling
- **Client-to-Server**: GraphQL API for flexible, client-driven data fetching
- **Real-time**: WebSockets for live updates and logging

### C4 Model Diagrams

The architecture is visualized using the C4 model, providing clear insights into the system at different levels of abstraction:

#### System Context
![System Context](images/structurizr-SystemContext-001.png)

#### Container View
![Container View](images/structurizr-ContainerView.png)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express
- **API**: GraphQL (Apollo Server), gRPC, REST
- **Real-time**: WebSockets (ws)
- **Database**: MongoDB
- **Messaging**: Apache Kafka
- **Authentication**: JWT

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **State Management**: Apollo Client
- **Routing**: React Router
- **UI Components**: Custom CSS with design system

### DevOps
- **Containerization**: Docker and Docker Compose
- **Architecture**: C4 Model with Structurizr

## ✨ Features

- **User Management**
  - Registration and authentication
  - Profile management
  - Session handling with JWT

- **Product Catalog**
  - Product browsing and search
  - Category filtering
  - Detailed product views

- **Shopping Experience**
  - Shopping cart management
  - Checkout process
  - Order history

- **Admin Dashboard**
  - Product management (CRUD operations)
  - Order fulfillment
  - Analytics and reporting

- **System**
  - Real-time logging and monitoring with WebSockets
  - Event-driven architecture
  - Fault tolerance and resilience patterns
  - Live data streaming

## 📦 Installation

### Prerequisites

- **Node.js** (v16.x or higher)
- **Docker** and **Docker Compose**
- **Git**

### Setup Instructions

1. Clone the repository:
   ```sh
   git clone https://github.com/TBG101/soa_poly_4eme.git
   cd soa_poly_4eme
   ```

2. Start the infrastructure services with Docker:
   ```sh
   docker-compose up -d
   ```
   This will start MongoDB, Kafka, and Zookeeper.

3. Install dependencies and start the services:

   a. Install root dependencies:
   ```sh
   npm install
   ```

   b. Install and start the backend services:
   ```sh
   # User Service
   cd userService
   npm install
   npm start &

   # Product Service
   cd ../productService
   npm install
   npm start &

   # Order Service
   cd ../orderService
   npm install
   npm start &

   # Logging Service
   cd ../logginService
   npm install
   npm start &

   # API Gateway
   cd ../apiGateway
   npm install
   npm start &
   ```

   c. Install and start the frontend:
   ```sh
   cd ../frontned/soa_frontend
   npm install
   npm run dev
   ```

## 🖥️ Usage

Once all services are running:

1. Access the web application at `http://localhost:5173`
2. Access GraphQL Playground at `http://localhost:5000/graphql`
3. REST API available at `http://localhost:5000/api/*`
4. Live logs available via WebSockets at `ws://localhost:8080`

### Main User Flows:

- **Browse products**: Navigate the product catalog
- **Create an account**: Register as a new user
- **Add items to cart**: Select products and add them to your shopping cart
- **Checkout**: Complete the purchase process
- **View orders**: Check your order history and status
- **Admin section**: Manage products and view analytics (admin users only)
- **Live monitoring**: Connect to WebSocket for real-time logging and updates

## 📚 API Documentation

The system provides multiple API interfaces:

### GraphQL API

Available at `/graphql` endpoint with the following key operations:

- **Queries**:
  - `getUser`: Get current user details
  - `getProduct`: Get detailed product information
  - `getProductList`: Get paginated products with filters
  - `getOrder`: Get order details
  - `getAllOrders`: Get paginated order list

- **Mutations**:
  - `createUser`: Register a new user
  - `login`: Authenticate and get a JWT token
  - `createProduct`: Add a new product
  - `updateProduct`: Update existing product
  - `createOrder`: Place a new order
  - `sendLogs`: Send logging information

### REST API

The system also provides a RESTful API for traditional HTTP-based integration:

#### User Endpoints
- `GET /api/user` - Get current user information
- `POST /api/user` - Create a new user account
- `POST /api/login` - Authenticate and get JWT token

#### Product Endpoints
- `GET /api/product/:id` - Get product details by ID
- `GET /api/products` - List products with pagination and search
- `POST /api/product` - Create a new product
- `PUT /api/product/:id` - Update an existing product
- `DELETE /api/product/:id` - Remove a product

#### Order Endpoints
- `GET /api/order/:id` - Get order details
- `GET /api/orders` - List all orders with pagination
- `POST /api/order` - Create a new order

#### Log Endpoints
- `POST /api/logs` - Send system logs

### WebSocket API

Real-time communication for logging and event streaming:

- Connect to `ws://localhost:8080` for live log streaming
- Live updates for order status changes and notifications

### gRPC Services

Internal communication is handled via gRPC with Protocol Buffers:

- `user.proto`: User management operations
- `product.proto`: Product catalog operations
- `order.proto`: Order processing operations

## 🧑‍💻 Development

The system uses an event-driven architecture where services communicate asynchronously via Kafka events:

- `order_placed`: Triggered when a new order is created
- `logs`: System logs for monitoring and debugging

### Real-time Communication

The logging service implements WebSockets to provide real-time monitoring capabilities:

```javascript
// WebSocket server setup
import { WebSocketServer } from 'ws';

// Initialize WebSocket server
const wss = new WebSocketServer({ port: 8080 });

// Broadcast logs to all connected clients
wss.broadcastLog = (log) => {
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(log));
        }
    });
};
```

## 📄 License

This project was developed as a university assignment at Polytechnique Sousse and is provided for educational purposes.


