import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaUserPlus } from "react-icons/fa";
import "./Register.css";

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const registerSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        

        if (user.password !== user.confirmPassword) {
            alert("Passwords do not match!");
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.post("/api/v1/users/register", {
                name: user.name,
                email: user.email,
                password: user.password
            });
            
            localStorage.setItem("token", res.data.token);
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="page-container">
            <div className="register-center-container">
                <form className="register-form" onSubmit={registerSubmit}>
                    <h2>Create Account</h2>
                    
                    <div className="input-group">
                        <div className="input-wrapper">
                            <FaUser className="input-icon" />
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Enter your full name"
                                value={user.name}
                                onChange={onChangeInput}
                            />
                        </div>
                    </div>

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
                                placeholder="Create a password"
                                value={user.password}
                                onChange={onChangeInput}
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

                    <div className="input-group">
                        <div className="input-wrapper">
                            <FaLock className="input-icon" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                required
                                placeholder="Confirm your password"
                                value={user.confirmPassword}
                                onChange={onChangeInput}
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="password-toggle"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className={isLoading ? 'loading' : ''}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="spinner"></div>
                            ) : (
                                <>
                                    <FaUserPlus style={{ marginRight: '0.5rem' }} />
                                    Create Account
                                </>
                            )}
                        </button>
                    </div>

                    <div className="login-link-container">
                        <p>Already have an account?
                            <Link to="/login">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
            
            <div className="shop-footer">
                <p>© 2024 30DC Shop. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Register;