import Product from "../models/productSchema.js";

function GetProduct(call, callback) {
  console.log("GetProduct", call.request);
  if (!call.request.id) return callback(new Error("Product ID is required"));

  Product.findById(call.request.id)
    .then((product) => {
      if (!product) return callback(new Error("Product not found"));
      callback(null, {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
      });
    })
    .catch((err) => callback(err));
}

function GetProductList(call, callback) {
  const { page, limit, search } = call.request;
  console.log("GetProductList", call.request);
  const query = search ? { name: { $regex: search, $options: "i" } } : {};
  const skip = (page - 1) * limit;

  Product.countDocuments(query)
    .then((total) => {
      const totalPage = Math.ceil(total / limit);
      Product.find(query)
        .skip(skip)
        .limit(limit)
        .then((products) => {
          if (!products) return callback(new Error("Products not found"));
          console.log("GetProductList", products);
          const productList = products.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
          }));
          callback(null, {
            page,
            limit,
            total,
            totalPage,
            search: search || "",
            products: productList,
          });
        })
        .catch((err) => callback(err));
    })
    .catch((err) => callback(err));
}

function CreateProduct(call, callback) {
  const { name, description, price, stock } = call.request;
  console.log("CreateProduct", call.request);

  const product = new Product({ name, description, price, stock });
  product
    .save()
    .then((savedProduct) => {
      callback(null, {
        id: savedProduct.id,
        name: savedProduct.name,
        description: savedProduct.description,
        price: savedProduct.price,
        stock: savedProduct.stock,
      });
    })
    .catch((err) => callback(err));
}

const grpcProductMethods = {
  GetProduct,
  GetProductList,
  CreateProduct,
};

export default grpcProductMethods;
