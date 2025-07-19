import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdClose, MdOutlineMenu, MdOutlineAddShoppingCart } from "react-icons/md";
import { GlobalState } from "../GlobalState";
import { useSelector } from "react-redux";
import axios from 'axios';
import "./header.css";

const Header = () => {
  const state = useContext(GlobalState);
  const navigate = useNavigate();
  const [isLogged, setLoggedIn] = state.userApi.isLogged;
  const [isAdmin, setIsAdmin] = state.userApi.isAdmin;
  const [isCart] = state.userApi.isCart;
  const [authChecked] = state.userApi.authChecked;
  const totalItems =useSelector(state => state.cart.totalItems);

  const logoutUser = async () => {
    try {
      await axios.post('/api/v1/users/logout');
      localStorage.clear();
      setIsAdmin(false);
      setLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err.message);
    }
  };

  const adminRouter = () => (
    <>
      <li><Link to='/create_product'>Create Product</Link></li>
      <li><Link to='/category'>Categories</Link></li>
    </>
  );

  const loggedRouter = () => (
    <>
      <li><Link to='/history'>History</Link></li>
      <li><Link to='/login' onClick={logoutUser}>Logout</Link></li>
    </>
  );

  
  if (!authChecked) {
    return (
      <header>
        <div className="header-container">
          <div className="logo">
            <h1>
              <Link to="/">30DC SHOP</Link>
            </h1>
          </div>
          <nav style={{ display: "flex", alignItems: "center" }}>
            <ul>
              <li>Loading...</li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header>
      <div className="header-container">
        <div className="logo">
          <h1>
            <Link to="/">{isAdmin ? "Admin" : "30DC SHOP"}</Link>
          </h1>
        </div>

        <nav style={{ display: "flex", alignItems: "center" }}>
          <ul>
            <li><Link to="/">{isAdmin ? 'Products' : 'Shop'}</Link></li>
            {isAdmin && adminRouter()}
            {isLogged ? loggedRouter() : (
              <>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            )}
            <li>
              <MdClose size={30} className='menu' />
            </li>
          </ul>

          {!isAdmin && (
            <div className="cart-icon">
              <span>{totalItems}</span>
              <Link to='/cart'>
                <MdOutlineAddShoppingCart size={30} />
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;