import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_PRODUCT_LIST,
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
} from "../api/graphqlQueries";
import "./AdminProductsPage.css";

interface Product {
  id: string;
  name: string;
  description: string;
  stock: number;
  price: number;
}

interface ProductForm {
  name: string;
  description: string;
  stock: number;
  price: number;
}

const AdminProductsPage: React.FC = () => {
  const { data, loading, refetch } = useQuery(GET_PRODUCT_LIST, {
    variables: { page: 1, limit: 10, search: "" },
  });

  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    stock: 0,
    price: 0,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "stock" || name === "price" ? Number(value) : value,
    });
  };

  const handleCreateOrUpdate = async () => {
    if (editingProduct) {
      await updateProduct({ variables: { id: editingProduct.id, ...form } });
    } else {
      await createProduct({ variables: form });
    }
    setForm({ name: "", description: "", stock: 0, price: 0 });
    setEditingProduct(null);
    refetch();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm(product);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct({ variables: { id } });
    refetch();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-products-page">
      <h1 className="title">Admin Products Page</h1>
      <div className="form-container">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleInputChange}
          className="input-field"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleInputChange}
          className="input-field"
        />
        <button onClick={handleCreateOrUpdate} className="action-button">
          {editingProduct ? "Update" : "Create"} Product
        </button>
      </div>
      <ul className="product-list">
        {data?.getProductList.products.map((product: Product) => (
          <li key={product.id} className="product-item">
            <div className="product-details">
              <span className="product-name">{product.name}</span>
              <span className="product-description">{product.description}</span>
              <span className="product-stock">Stock: {product.stock}</span>
              <span className="product-price">Price: ${product.price}</span>
            </div>
            <div className="product-actions">
              <button
                onClick={() => handleEdit(product)}
                className="edit-button"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProductsPage;
