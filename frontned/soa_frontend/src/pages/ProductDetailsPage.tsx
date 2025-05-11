import React from "react";
import { useParams } from "react-router-dom";
import { GET_PRODUCT } from "../api/graphqlQueries";
import { useQuery } from "@apollo/client";
import "../assets/style/ProductDetailsPage.css";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_PRODUCT, { variables: { id } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product = data?.getProduct;

  return (
    <div className="product-details-container">
      <h1 className="product-details-title">{product?.name}</h1>
      <p className="product-details-description">{product?.description}</p>
      <p>Price: ${product?.price}</p>
    </div>
  );
};

export default ProductDetailsPage;
