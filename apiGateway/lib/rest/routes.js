import { userController } from '../controllers/userController.js';
import { productController } from '../controllers/productController.js';
import { orderController } from '../controllers/orderController.js';
import { logController } from '../controllers/logController.js';

export const routes = (app, userClient, productClient, orderClient) => {
    // User routes
    app.get('/api/user', (req, res) => {
        userController.getUser(userClient, req.user)
            .then(data => res.json(data))
            .catch(err => res.status(401).json({ error: err.message }));
    });

    app.post('/api/user', (req, res) => {
        const { username, password } = req.body;
        userController.createUser(userClient, username, password)
            .then(data => res.json(data))
            .catch(err => res.status(400).json({ error: err.message }));
    });

    app.post('/api/login', (req, res) => {
        const { username, password } = req.body;
        userController.login(userClient, username, password)
            .then(data => res.json(data))
            .catch(err => res.status(400).json({ error: err.message }));
    });

    // Product routes
    app.get('/api/product/:id', (req, res) => {
        productController.getProduct(productClient, req.params.id)
            .then(data => res.json(data))
            .catch(err => res.status(404).json({ error: err.message }));
    });

    app.get('/api/products', (req, res) => {
        const { page, limit, search } = req.query;
        productController.getProductList(productClient, page, limit, search)
            .then(data => res.json(data))
            .catch(err => res.status(400).json({ error: err.message }));
    });

    app.post('/api/product', (req, res) => {
        const { name, description, stock, price } = req.body;
        productController.createProduct(productClient, name, description, stock, price)
            .then(data => res.json(data))
            .catch(err => res.status(400).json({ error: err.message }));
    });

    app.put('/api/product/:id', (req, res) => {
        const { name, description, stock, price } = req.body;
        productController.updateProduct(productClient, req.params.id, name, description, stock, price)
            .then(data => res.json(data))
            .catch(err => res.status(400).json({ error: err.message }));
    });

    app.delete('/api/product/:id', (req, res) => {
        productController.deleteProduct(productClient, req.params.id)
            .then(data => res.json(data))
            .catch(err => res.status(400).json({ error: err.message }));
    });

    // Order routes
    app.get('/api/order/:id', (req, res) => {
        orderController.getOrder(orderClient, req.params.id)
            .then(data => res.json(data))
            .catch(err => res.status(404).json({ error: err.message }));
    });

    app.get('/api/orders', (req, res) => {
        const { page, limit } = req.query;
        orderController.getAllOrders(orderClient, page, limit)
            .then(data => res.json(data))
            .catch(err => res.status(400).json({ error: err.message }));
    });

    app.post('/api/order', (req, res) => {
        const { products } = req.body;
        orderController.createOrder(orderClient, req.user, products)
            .then(data => res.json(data))
            .catch(err => res.status(400).json({ error: err.message }));
    });

    // Log routes
    app.post('/api/logs', (req, res) => {
        const { message, source, level } = req.body;
        logController.sendLogs(message, source, level)
            .then(data => res.json(data))
            .catch(err => res.status(400).json({ error: err.message }));
    });
};