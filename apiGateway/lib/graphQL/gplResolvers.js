export const createResolvers = (userClient, productClient, orderClient) => {
  return {
    Query: {
      getUser: (_, {}, { user }) =>
        new Promise((resolve, reject) => {
          const { id } = user;
          if (!id) {
            return reject(new Error("Unauthorized"));
          }
          userClient.GetUser({ id }, (err, response) => {
            if (err) reject(err);
            resolve(response);
          });
        }),

      getProduct: (_, { id }, { user }) =>
        new Promise((resolve, reject) => {
          productClient.GetProduct({ id }, (err, response) => {
            if (err) reject(err);
            resolve(response);
          });
        }),

      getOrdersByUserId: (_, {}, { user }) => {
        return new Promise((resolve, reject) => {
          const { id } = user;
          if (!id) {
            return reject(new Error("Unauthorized"));
          }

          orderClient.GetOrderByUserId({ id }, (err, response) => {
            if (err) reject(err);
            resolve(response);
          });
        });
      },

      getOrderById: (_, { orderId }, { user }) =>
        new Promise((resolve, reject) => {
          orderClient.GetOrderById({ id: orderId }, (err, response) => {
            if (err) reject(err);
            resolve(response);
          });
        }),

      getProductList: (_, { page, pageSize: limit, search }, { user }) => {
        return new Promise((resolve, reject) => {
          productClient.GetProductList(
            { page, pageSize: limit, search },
            (err, response) => {
              if (err) reject(err);
              resolve(response);
            }
          );
        });
      },
    },

    Mutation: {
      createUser: (_, { username, password }, { user }) =>
        new Promise((resolve, reject) => {
          userClient.CreateUser({ username, password }, (err, response) => {
            if (err) reject(err);
            resolve(response);
          });
        }),

      createProduct: (_, { name, description, stock, price }, { user }) =>
        new Promise((resolve, reject) => {
          productClient.CreateProduct(
            { name, description, stock, price },
            (err, response) => {
              if (err) reject(err);
              resolve(response);
            }
          );
        }),

      createOrder: (_, { products }, { user }) => {
        // Check if user is logged in
        if (!user || !user.id) {
          return new Error("Unauthorized");
        }

        return new Promise((resolve, reject) => {
          const { id: userId } = user;
          if (!userId) {
            return reject(new Error("Unauthorized"));
          }
          if (!products || products.length === 0) {
            return reject(new Error("No products provided"));
          }
          products.forEach((product) => {
            if (!product.productId || !product.quantity) {
              return reject(new Error("Invalid product format"));
            }
          });

          orderClient.CreateOrder({ userId, products }, (err, response) => {
            if (err) reject(err);
            resolve(response);
          });

          
        });
      },

      login: (_, { username, password }, { user }) => {
        if (user) {
          return new Error("User already logged in");
        }

        return new Promise((resolve, reject) => {
          userClient.Login({ username, password }, (err, response) => {
            if (err) reject(err);
            resolve(response);
          });
        });
      },
    },
  };
};
