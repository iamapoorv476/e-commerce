
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GlobalState } from "../GlobalState";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const state = useContext(GlobalState);
  const [isLogged] = state.userApi.isLogged;
  const [authChecked] = state.userApi.authChecked;
  const dispatch = useDispatch();

  useEffect(() => {
    
    const fetchDetails = async () => {
      if (!authChecked) return;
      
      if (!isLogged) {
        setError("Please login to view product details");
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching product with ID:', id);
        console.log('Request URL:', `/api/v1/products/${id}`);
        
        const res = await axios.get(`/api/v1/products/${id}`, {
          withCredentials: true,
        });
        
       
        
        
       
        
        
        setProduct(res.data.data);
        
      } catch (err) {
        console.error('Error fetching product:', err);
        console.error('Error response:', err.response?.data);
        
        if (err.response?.status === 401) {
          setError("Authentication required. Please login again.");
        } else {
          setError("Failed to load product details");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id, authChecked, isLogged]);

  if (!authChecked) {
    return <p>Checking authentication...</p>;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>No product found</p>;



  
  const getImageUrl = (product) => {
  
    if (product.images && product.images.url) {
      return product.images.url;
    }
    if (product.image && product.image.url) {
      return product.image.url;
    }
    if (product.imageUrl) {
      return product.imageUrl;
    }
    return null;
  };

  const imageUrl = getImageUrl(product);

  const handleAddToCart = () => {
  const payload = {
    id: product._id,
    title: product.title,
    price: product.price,
    image: getImageUrl(product),
  };
  dispatch(addToCart(payload));
};


  return (
    <div className="product-detail-container" style={{ padding: '20px' }}>
     
      
      
      <h2>{product.title || product.name || 'No title available'}</h2>
      
      {imageUrl ? (
        <img 
          src={imageUrl}
          alt={product.title || product.name || 'Product image'}
          style={{ maxWidth: '400px', height: 'auto', display: 'block', marginBottom: '20px' }}
          onError={(e) => {
            console.log('Image failed to load:', e.target.src);
            e.target.style.display = 'none';
           
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
              width: 400px; 
              height: 300px; 
              background: #f0f0f0; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: #666; 
              border: 1px solid #ddd;
              margin-bottom: 20px;
            `;
            placeholder.textContent = 'Image not available';
            e.target.parentNode.insertBefore(placeholder, e.target);
          }}
        />
      ) : (
        <div style={{
          width: '400px',
          height: '300px',
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          border: '1px solid #ddd',
          marginBottom: '20px'
        }}>
          No image available
        </div>
      )}
       <p><strong>Product ID:</strong> {product.product_id || 'N/A'}</p>
      
      <p><strong>Description:</strong> {product.description || 'No description available'}</p>
      <p><strong>Price:</strong> ₹{product.price || 'Price not available'}</p>
      <div className="product-detail-container button">
    <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
     
      
    </div>
  );
};

export default ProductDetails;