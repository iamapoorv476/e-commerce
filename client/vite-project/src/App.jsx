import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Register from './login/Register.jsx'
import Login from './login/Login.jsx'
import { Routes, Route } from "react-router-dom";
import Header from './components/header.jsx'
import Shop from './Products/Shop.jsx'
import Cart from './Cart/Cart.jsx';
import ProductDetails from './Products/ProductDetails.jsx'; 
import ContactUs from './payments/ContactUs.jsx';
import PrivacyPolicy from './payments/PrivacyPolicy.jsx';
import ShippingPolicy from './payments/ShippingPolicy.jsx';
import TermsAndConditions from './payments/TermsAndConditions.jsx';
import RefundPolicy from './payments/RefundPolicy.jsx';
function App() {
  return (
    <>
      <Header/>
       <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/" element={<Shop />} />
        <Route path ="/cart" element ={<Cart/>}/>
      
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
<Route path="/terms-and-conditions" element={<TermsAndConditions />} />
<Route path="/shipping-policy" element={<ShippingPolicy />} />
<Route path="/privacy-policy" element={<PrivacyPolicy />} />
<Route path="/contact" element={<ContactUs />} />

      </Routes>
    </>
  )
}

export default App;