import { userController } from '../controllers/userController.js';
import { productController } from '../controllers/productController.js';
import { orderController } from '../controllers/orderController.js';
import { logController } from '../controllers/logController.js';

export const createResolvers = (userClient, productClient, orderClient) => {
  return {
    Query: {

      getUser: (_, { }, { user }) => userController.getUser(userClient, user),

      getProduct: (_, { id }, { user }) => productController.getProduct(productClient, id),

      getOrder: (_, { id }, { user }) => orderController.getOrder(orderClient, id),

      getOrdersByUserId: (_, { }, { user }) => orderController.getOrdersByUserId(orderClient, user),

      getProductList: (_, { page, limit, search }, { user }) =>
        productController.getProductList(productClient, page, limit, search),

      getAllOrders: (_, { page = 1, limit = 10 }, { user }) =>
        orderController.getAllOrders(orderClient, page, limit),
    },

    Mutation: {
      createUser: (_, { username, password }, { user }) =>
        userController.createUser(userClient, username, password),

      createProduct: (_, { name, description, stock, price }, { user }) =>
        productController.createProduct(productClient, name, description, stock, price),

      updateProduct: (_, { id, name, description, stock, price }, { user }) =>
        productController.updateProduct(productClient, id, name, description, stock, price),

      deleteProduct: (_, { id }, { user }) =>
        productController.deleteProduct(productClient, id),

      createOrder: (_, { products }, { user }) =>
        orderController.createOrder(orderClient, user, products),

      login: (_, { username, password }, { user }) =>
        userController.login(userClient, username, password),

      sendLogs: (_, { message, source, level }, { user }) =>
        logController.sendLogs(message, source, level),
    },
  };
};
