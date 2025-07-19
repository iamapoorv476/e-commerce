import React, { useEffect, useState } from "react";
import { GlobalState } from "./GlobalState";
import axios from "axios";

const GlobalProvider = ({ children }) => {
  const [isLogged, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCart, setIsCartIn] = useState([]);
  const [authChecked, setAuthChecked] = useState(false); 

  const refreshUser = async () => {
    try {
      const res = await axios.get("/api/v1/users/current-user");
      console.log("User authenticated:", res.data);
      setLoggedIn(true);
      setIsAdmin(res.data.role === "admin");
      setIsCartIn(res.data.cart || []);
    } catch (err) {
      console.log("User not logged in:", err.response?.status);
      
      setLoggedIn(false);
      setIsAdmin(false);
      setIsCartIn([]);
    } finally {
      setAuthChecked(true); 
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const state = {
    userApi: {
      isLogged: [isLogged, setLoggedIn],
      isAdmin: [isAdmin, setIsAdmin],
      isCart: [isCart, setIsCartIn],
      authChecked: [authChecked, setAuthChecked], 
      refreshUser,
    },
  };

  return (
    <GlobalState.Provider value={state}>
      {children}
    </GlobalState.Provider>
  );
};

export default GlobalProvider;