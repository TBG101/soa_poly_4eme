/**
 * @param {*} userClient
 * @param {*} productClient
 * @param {*} orderClient
 * @returns
 */

export const createResolvers = (userClient, productClient, orderClient) => {
  return {
    Query: {
      getUser: (_, { id }, { user }) =>
        new Promise((resolve, reject) => {
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

      getOrder: (_, { id }, { user }) =>
        new Promise((resolve, reject) => {
          orderClient.GetOrder({ id }, (err, response) => {
            if (err) reject(err);
            resolve(response);
          });
        }),
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

      createOrder: (_, { userId, products, quantity, price }, { user }) =>
        new Promise((resolve, reject) => {
          orderClient.CreateOrder(
            { userId, products, quantity, price },
            (err, response) => {
              if (err) reject(err);
              resolve(response);
            }
          );
        }),
    },
  };
};
