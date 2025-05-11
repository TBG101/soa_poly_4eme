import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import dotenv from "dotenv";

dotenv.config({
    path: "../.env",
});

// Load gRPC Protobuf Definitions
const userProto = protoLoader.loadSync(process.env.PROTO_SCHEMA_PATH + "/user.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const productProto = protoLoader.loadSync(process.env.PROTO_SCHEMA_PATH + "/product.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const orderProto = protoLoader.loadSync(process.env.PROTO_SCHEMA_PATH + "/order.proto", {
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

export { userClient, productClient, orderClient };
