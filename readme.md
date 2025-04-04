# E-Commerce System

## Table of Contents
- [E-Commerce System](#e-commerce-system)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Technologies Used](#technologies-used)
  - [Architecture](#architecture)
  - [C4 Model](#c4-model)
  - [Setup and Installation](#setup-and-installation)
    - [Prerequisites](#prerequisites)
    - [Steps to Run the Project](#steps-to-run-the-project)
  - [Usage](#usage)
  - [Future Improvements](#future-improvements)
  - [Contributors](#contributors)

## Overview
E-Commerce System is an advanced, full-stack e-commerce platform designed as a microservices-based architecture. This project was developed as part of a university assignment at **Polytechnique Sousse**.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Messaging System**: Kafka
- **APIs**:
  - GraphQL
  - Protocol Buffers (ProtoBuf)
- **Frontend**: (Mention the frontend technology if applicable, e.g., React, Angular, Vue.js)
- **Containerization & Deployment**: (Mention Docker, Kubernetes, or any CI/CD tools used, if any)

## Architecture
This e-commerce system follows a microservices-based architecture. The key services include:
- **User Service**: Handles authentication and user management.
- **Product Service**: Manages product catalog.
- **Order Service**: Processes orders and transactions.
- **Payment Service**: Manages payments and transactions.
- **Notification Service**: Sends order updates and promotional notifications.
- **API Gateway**: Serves as a single entry point for client requests, using GraphQL and Protocol Buffers for communication.

## C4 Model
The system architecture is illustrated using the **C4 model** diagrams, which are available in the `/images` directory:
- `structurizr-ContainerView-key.png`
- `structurizr-ContainerView.png`
- `structurizr-SystemContext-001.png`
- `structurizr-SystemContext-key.png`

These diagrams provide a clear understanding of how different components interact within the system.

## Setup and Installation
### Prerequisites
- Install **Node.js** and **npm**
- Install **MongoDB**
- Install **Kafka** and configure it properly

### Steps to Run the Project
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/ecommerce-system.git
   cd ecommerce-system
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start Kafka:
   ```sh
   (Follow Kafka installation and startup instructions based on your OS)
   ```
4. Start the services:
   ```sh
   npm start
   ```
5. Access the API via GraphQL Playground or any API testing tool.

## Usage
- Register and log in as a user.
- Browse and add products to the cart.
- Place orders and proceed to checkout.
- Track orders via notifications.

## Future Improvements
- Implement a recommendation engine.
- Add support for multiple payment gateways.
- Deploy using Kubernetes for better scalability.

## Contributors
- **Your Name** - Developer
- **Professor/Supervisor Name** - Supervisor (if applicable)

---
Feel free to update this README as your project evolves!

