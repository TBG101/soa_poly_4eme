import e from "cors";
import Order from "../models/orderSchema.js";
import { productClient } from "./grpcProduct.js";
import { producer } from "./kafka.js";

const GetOrdersByUserId = async (call, callback) => {
  const userId = call.request.userId;
  const orders = await Order.find({ userId });

  if (!orders) {
    return callback(null, { orders: [] });
  }

  const userOrders = orders.map((order) => {
    return {
      id: order._id,
      userId: order ? order.userId : null,
      products: order.products,
      price: order.price,
    };
  });

  callback(null, { orders: userOrders });
};

const GetOrderById = (call, callback) => {
  const orderId = call.request.orderId;

  Order.findById(orderId, (err, order) => {
    if (err) {
      return callback({
        orders: [],
      });
    }

    const userOrder = {
      id: order._id,
      userId: order.userId,
      products: order.products.map((product) => {
        return {
          id: product.id,
          quantity: product.quantity,
        };
      }),
      price: order.price,
    };

    callback(null, { order: userOrder });
  });
};

const CreateOrder = async (call, callback) => {
  const { userId, products } = call.request;
  if (!userId) {
    return callback(new Error("User ID is required"));
  }
  if (!products || products.length === 0) {
    return callback(new Error("No products provided"));
  }

  let price = 0;
  for (const element of products) {
    if (!element.productId || !element.quantity || element.quantity <= 0) {
      return callback(new Error("Invalid product format"));
    }
    await new Promise((resolve, reject) => {
      productClient.GetProduct({ id: element.productId }, (err, response) => {
        if (err) {
          reject(new Error("Product not found"));
        } else {
          price += response.price * element.quantity;
          resolve(response);
        }
      });
    });
  }

  new Order({
    userId: userId,
    products: products.map((product) => {
      return {
        productId: product.productId,
        quantity: product.quantity,
      };
    }),
    price: price,
  })
    .save()
    .then(async (order) => {
      console.log("order_placed", order);

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
        id: order.id,
        userId: userId,
        products: products.map((product) => {
          return {
            productId: product.productId,
            quantity: product.quantity,
          };
        }),
        price: price,
      });
    })
    .catch((err) => {
      console.error("Error creating order:", err);
      callback(new Error("Failed to create order"));
    });
};

const UpdateOrder = (call, callback) => {
  const orderId = call.request.orderId;
  const updatedOrder = {
    userId: call.request.userId,
    products: call.request.products.map((product) => {
      return {
        id: product.id,
        quantity: product.quantity,
      };
    }),
    price: call.request.price,
  };

  Order.findByIdAndUpdate(
    orderId,
    updatedOrder,
    { new: true },
    (err, order) => {
      if (err || !order) {
        return callback(new Error("Order not found"));
      }

      const userOrder = {
        id: order._id,
        userId: order.userId,
        products: order.products.map((product) => {
          return {
            id: product.id,
            quantity: product.quantity,
          };
        }),
        price: order.price,
      };

      callback(null, { order: userOrder });
    }
  );
};

const DeleteOrder = (call, callback) => {
  const orderId = call.request.orderId;

  Order.findByIdAndDelete(orderId, (err) => {
    if (err) {
      return callback(new Error("Order not found"));
    }

    callback(null, { success: true });
  });
};

export const grpcOrderMethods = {
  GetOrdersByUserId,
  GetOrderById,
  CreateOrder,
  UpdateOrder,
  DeleteOrder,
};
