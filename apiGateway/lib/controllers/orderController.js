export const orderController = {
    getOrder: (orderClient, id) =>
        new Promise((resolve, reject) => {
            orderClient.GetOrderById({ id }, (err, response) => {
                if (err) reject(err);
                resolve(response);
            });
        }),

    getOrdersByUserId: (orderClient, user) =>
        new Promise((resolve, reject) => {
            const { id } = user;
            if (!id) {
                return reject(new Error("Unauthorized"));
            }
            orderClient.GetOrderByUserId({ id }, (err, response) => {
                if (err) reject(err);
                resolve(response);
            });
        }),

    getAllOrders: (orderClient, page, limit) =>
        new Promise((resolve, reject) => {
            orderClient.GetAllOrders({ page, limit }, (err, response) => {
                if (err) return reject(err);
                resolve(response);
            });
        }),

    createOrder: (orderClient, user, products) =>
        new Promise((resolve, reject) => {
            const { id: userId } = user;
            if (!userId) {
                return reject(new Error("Unauthorized"));
            }
            if (!products || products.length === 0) {
                return reject(new Error("No products provided"));
            }
            for (const product of products) {
                if (!product.productId || typeof product.quantity !== 'number') {
                    return reject(new Error("Invalid product format"));
                }
            }
            orderClient.CreateOrder({ userId, products }, (err, response) => {
                if (err) return reject(err);
                resolve(response);
            });
        }),
};
