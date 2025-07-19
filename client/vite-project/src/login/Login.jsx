import React, { useState } from "react";
import axios from "axios";
import { GlobalState } from "../GlobalState";

import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import "./Login.css";
import { useContext } from "react";

const Login = () => {
    const navigate = useNavigate();
    const {userApi} =useContext(GlobalState);
    const { refreshUser } = userApi;
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value })
    };

    const loginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("Login form submitted");
        try {
            const res = await axios.post("/api/v1/users/login", {
                email: user.email,
                password: user.password
            });
            localStorage.setItem("token", res.data.token);
            await refreshUser();
            navigate("/");
        }
        catch (err) {
            alert(err.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-icon">
                            <FaUser />
                        </div>
                        <h2>Welcome Back</h2>
                        <p>Please sign in to your account</p>
                    </div>
                    
                    <form className="login-form" onSubmit={loginSubmit}>
                        <div className="input-group">
                            <div className="input-wrapper">
                                <FaEnvelope className="input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="Enter your email"
                                    value={user.email}
                                    onChange={onChangeInput}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <div className="input-wrapper">
                                <FaLock className="input-icon" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    placeholder="Enter your password"
                                    value={user.password}
                                    onChange={onChangeInput}
                                    className="form-input"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="password-toggle"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-wrapper">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="forgot-password">
                                Forgot Password?
                            </Link>
                        </div>

                        <button 
                            type="submit" 
                            className={`login-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="spinner"></div>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        <div className="login-footer">
                            <p>Don't have an account? 
                                <Link to="/register" className="register-link">
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;