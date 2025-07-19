import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart } from '../redux/cartSlice';
import './Cart.css';
import { Link } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);
  const totalItems = useSelector(state => state.cart.totalItems);
  const totalPrice = useSelector(state => state.cart.totalPrice);

  if (cartItems.length === 0) {
    return <h2 style={{ textAlign: "center", fontSize: "2rem" }}>Your cart is empty</h2>;
  }

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      {cartItems.map(item => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.title} />
          <div className="cart-info">
            <h3>{item.title}</h3>
            <p>Price: ₹{item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
          </div>
        </div>
      ))}
      <div className="cart-summary">
        <p>Total Items: {totalItems}</p>
        <p>Total Price: ₹{totalPrice}</p>
        <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
        <Link to="/checkout"><button>Proceed to Checkout</button></Link>
      </div>
    </div>
  );
};

export default Cart;
