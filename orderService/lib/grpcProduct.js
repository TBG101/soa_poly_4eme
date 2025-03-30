import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const productProto = protoLoader.loadSync("./protos/product.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const ProductService = grpc.loadPackageDefinition(productProto).ProductService;

export const productClient = new ProductService(
  "localhost:5002",
  grpc.credentials.createInsecure()
);
