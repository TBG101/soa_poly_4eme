import Order from "../models/orderSchema.js";
import { productClient } from "./grpcProductClient.js";
import { producer } from "./kafka.js";

// Get orders by user ID (returns ListOrder)
const GetOrdersByUserId = async (call, callback) => {
  const userId = call.request.id;
  const orders = await Order.find({ userId });
  const userOrders = orders.map((order) => ({
    id: order._id.toString(),
    userId: order.userId,
    products: order.products.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
    })),
    price: order.price,
  }));
  callback(null, { orders: userOrders });
};

// Get order by ID (returns Order)
const GetOrderById = async (call, callback) => {
  const orderId = call.request.id;
  const order = await Order.findById(orderId);
  if (!order) return callback(new Error("Order not found"));
  const userOrder = {
    id: order._id.toString(),
    userId: order.userId,
    products: order.products.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
    })),
    price: order.price,
  };
  callback(null, userOrder);
};

// Create order (returns Order)
const CreateOrder = async (call, callback) => {
  const { userId, products } = call.request;
  if (!userId) return callback(new Error("User ID is required"));
  if (!products || products.length === 0)
    return callback(new Error("No products provided"));
  let price = 0;
  for (const element of products) {
    if (!element.productId || !element.quantity || element.quantity <= 0) {
      return callback(new Error("Invalid product format"));
    }
    await new Promise((resolve, reject) => {
      productClient.GetProduct({ id: element.productId }, (err, response) => {
        if (err) reject(new Error("Product not found"));
        else {
          price += response.price * element.quantity;
          resolve(response);
        }
      });
    });
  }
  new Order({
    userId,
    products: products.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
    })),
    price,
  })
    .save()
    .then(async (order) => {
      await producer.send({
        topic: "order_placed",
        messages: [
          {
            key: order._id.toString(),
            value: JSON.stringify({ products }),
          },
        ],
      });
      callback(null, {
        id: order._id.toString(),
        userId,
        products: products.map((product) => ({
          productId: product.productId,
          quantity: product.quantity,
        })),
        price,
      });
    })
    .catch((err) => {
      callback(new Error("Failed to create order"));
    });
};

// Update order (returns Order)
const UpdateOrder = async (call, callback) => {
  const { id, userId, products, price } = call.request;
  const updatedOrder = {
    userId,
    products: products.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
    })),
    price,
  };
  const order = await Order.findByIdAndUpdate(id, updatedOrder, { new: true });
  if (!order) return callback(new Error("Order not found"));
  callback(null, {
    id: order._id.toString(),
    userId: order.userId,
    products: order.products.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
    })),
    price: order.price,
  });
};

// Delete order (returns Order)
const DeleteOrder = async (call, callback) => {
  const orderId = call.request.id;
  const order = await Order.findByIdAndDelete(orderId);
  if (!order) return callback(new Error("Order not found"));
  callback(null, {
    id: order._id.toString(),
    userId: order.userId,
    products: order.products.map((p) => ({
      productId: p.productId,
      quantity: p.quantity,
    })),
    price: order.price,
  });
};

// Get all orders with pagination (returns OrderListResponse)
const GetAllOrders = async (call, callback) => {
  const { page, limit } = call.request;
  const pageNum = page > 0 ? page : 1;
  const lim = limit > 0 ? limit : 10;
  const total = await Order.countDocuments();
  const orders = await Order.find()
    .skip((pageNum - 1) * lim)
    .limit(lim);
  const orderList = orders.map((order) => ({
    id: order._id.toString(),
    userId: order.userId,
    products: order.products.map((p) => ({
      productId: p.productId,
      quantity: p.quantity,
    })),
    price: order.price,
  }));
  const totalPage = Math.ceil(total / lim);
  callback(null, {
    page: pageNum,
    limit: lim,
    total,
    totalPage,
    orders: orderList,
  });
};

export const grpcOrderMethods = {
  GetOrdersByUserId,
  GetOrderById,
  CreateOrder,
  UpdateOrder,
  DeleteOrder,
  GetAllOrders,
};
