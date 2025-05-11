export const productController = {
    getProduct: (productClient, id) =>
        new Promise((resolve, reject) => {
            productClient.GetProduct({ id }, (err, response) => {
                if (err) reject(err);
                resolve(response);
            });
        }),

    getProductList: (productClient, page, limit, search) =>
        new Promise((resolve, reject) => {
            productClient.GetProductList(
                { page, limit, search },
                (err, response) => {
                    if (err) return reject(err);
                    resolve(response);
                }
            );
        }),

    createProduct: (productClient, name, description, stock, price) =>
        new Promise((resolve, reject) => {
            productClient.CreateProduct(
                { name, description, stock, price },
                (err, response) => {
                    if (err) reject(err);
                    resolve(response);
                }
            );
        }),

    updateProduct: (productClient, id, name, description, stock, price) =>
        new Promise((resolve, reject) => {
            productClient.UpdateProduct(
                { id, name, description, stock, price },
                (err, response) => {
                    if (err) reject(err);
                    resolve(response);
                }
            );
        }),

    deleteProduct: (productClient, id) =>
        new Promise((resolve, reject) => {
            productClient.DeleteProduct(
                { id },
                (err, response) => {
                    if (err) reject(err);
                    resolve(response);
                }
            );
        }),
};
