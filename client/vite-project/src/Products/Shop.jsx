// src/pages/Shop.jsx
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../GlobalState";
import "./shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const state = useContext(GlobalState);
  const [isLogged] = state.userApi.isLogged;
  const [authChecked] = state.userApi.authChecked;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!authChecked) return;

      try {
        const res = await axios.get("/api/v1/products", {
          withCredentials: true,
        });
        setProducts(res.data.message);
        setError("");
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Please login to view products");
        } else {
          setError("Failed to fetch products");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [authChecked, isLogged]);

  if (!authChecked) {
    return (
      <div className="shop-container">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="shop-container">
      <h1 className="shop-title">All Products</h1>
      {loading && <p>Loading products...</p>}

      {error && (
        <div>
          <p>{error}</p>
          {!isLogged && <Link to="/login">Click here to login</Link>}
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <Link to={`/product/${product._id}`} className="product-link">
                <img
                  src={product.images?.url || "/placeholder-image.jpg"}
                  alt={product.title}
                  className="product-image"
                />
                <h3>{product.title}</h3>
                <p>₹{product.price}</p>
                <p>{product.description?.slice(0, 100)}...</p>
              </Link>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default Shop;
